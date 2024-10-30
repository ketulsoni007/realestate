import DoctorSchema from "../../models/DoctorSchema.js";
import UserSchema from "../models/UserSchema.js";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import WorkingHourSchema from "../../models/WorkingHourSchema.js";
import EducationSchema from "../../models/EducationSchema.js";
import ExperienceSchema from "../../models/ExperienceSchema.js";
import AppointmentSchema from "../../models/AppointmentSchema.js";

dotenv.config();


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/appointment');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

export const appointmentBookingController = async (req, res) => {
    upload.single('photo')(req, res, async (err) => {
        if (err) {
            return res.status(410).json({
                status: false,
                message: err.message || "Error uploading file",
                error: err.message,
            });
        }

        try {
            const file = req.file;
            const imagePath = file ? file.filename : null;
            const { doctor, patient, date, notes, status } = req.body;

            if (!doctor || !patient || !date || !status) {
                return res.status(410).json({
                    status: false,
                    message: "Missing required fields",
                });
            }

            // Convert date string to Date object and remove time part for comparison
            const appointmentDate = new Date(date);
            appointmentDate.setHours(0, 0, 0, 0);

            // Check if there's already an appointment for this doctor and patient on the same day
            const existingAppointment = await AppointmentSchema.findOne({
                doctor,
                patient,
                date: {
                    $gte: appointmentDate,
                    $lt: new Date(appointmentDate.getTime() + 24 * 60 * 60 * 1000) // Check within the same day
                }
            });

            if (existingAppointment) {
                return res.status(410).json({
                    status: false,
                    message: "You already have an appointment with this doctor on the same day.",
                });
            }

            // Create and save the new appointment
            const newAppointment = new AppointmentSchema({
                doctor,
                patient,
                date: new Date(date), // Convert date string to Date object
                notes,
                status,
                photo: imagePath, // Save the file path if required
            });

            const savedAppointment = await newAppointment.save();

            // Update the Doctor's appointments array
            await DoctorSchema.findByIdAndUpdate(
                doctor,
                { $push: { appointments: savedAppointment._id } },
                { new: true }
            );

            // Update the Patient's appointments array
            await UserSchema.findByIdAndUpdate(
                patient,
                { $push: { appointments: savedAppointment._id } },
                { new: true }
            );

            res.status(200).json({
                status: true,
                message: 'Appointment booked successfully',
            });
        } catch (error) {
            if (error.name === "ValidationError") {
                return res.status(422).json({
                    status: false,
                    message: "Validation failed",
                    errors: error.errors,
                });
            }

            console.error("Error creating appointment:", error);
            res.status(500).json({
                status: false,
                message: "Internal server error",
            });
        }
    });
};

export const appointmentGetController = async (req, res) => {
    try {


        return res.status(200).json({
            status: false,
            message: "Hello",
        });
    } catch (error) {
        console.error("Error retrieving doctor data:", error.message);
        return res.status(500).json({
            status: false,
            message: "Error retrieving doctor data",
            error: error.message,
        });
    }
};

export const doctorDropdownListController = async (req, res) => {
    try {
        // Fetch all doctors and populate their working hours
        const doctors = await DoctorSchema.find().populate('workingHours').select('-appointments -educations -experiences');

        // Return a successful response with the fetched data
        return res.status(200).json({
            status: true, // Set to true for successful operations
            message: "Doctors fetched successfully",
            doctors: doctors, // Renamed 'doctor' to 'data' to reflect that multiple records may be returned
        });
    } catch (error) {
        console.error("Error retrieving doctor data:", error.message);

        // Return an error response with the error message
        return res.status(500).json({
            status: false,
            message: "Error retrieving doctor data",
            error: error.message, // Provide error details for debugging
        });
    }
};

export const myAppointmentController = async (req, res) => {
    try {
        const { id, role, page = 1, limit = 8 } = req.body; // Get page and limit from request body
        const currentPage = Math.max(1, parseInt(page, 10));
        const itemsPerPage = Math.max(1, parseInt(limit, 10));
        const skip = (currentPage - 1) * itemsPerPage; // Calculate number of documents to skip

        let data;
        let totalAppointments;

        if (role === 'patient') {
            data = await UserSchema.findById(id)
                // .populate({
                //     path: 'appointments',
                //     populate: {
                //         path: 'doctor',
                //         select: '-workingHours -educations -experiences'
                //     }
                // })
                .populate({
                    path: 'appointments',
                    populate: [
                        {
                            path: 'patient',
                            select: '-appointments' // Exclude appointments to avoid potential circular references
                        },
                        {
                            path: 'doctor', // This is usually not necessary as you are querying for doctor appointments
                            select: '-appointments -educations -experiences'
                        }
                    ]
                })
                .exec(); // Ensure the query is executed

            totalAppointments = data.appointments.length;
            const paginatedAppointments = data.appointments.slice(skip, skip + itemsPerPage);

            return res.status(200).json({
                status: true,
                message: "Appointments fetched successfully",
                data: {
                    appointments: paginatedAppointments,
                    totalAppointments: totalAppointments,
                    totalPages: Math.ceil(totalAppointments / itemsPerPage),
                    currentPage: currentPage
                }
            });
        } else if (role === 'doctor') {
            data = await DoctorSchema.findById(id)
                .populate({
                    path: 'appointments',
                    populate: [
                        {
                            path: 'patient',
                            select: '-appointments' // Exclude appointments to avoid potential circular references
                        },
                        {
                            path: 'doctor', // This is usually not necessary as you are querying for doctor appointments
                            select: '-appointments -educations -experiences'
                        }
                    ]
                })
                .exec(); // Ensure the query is executed

            totalAppointments = data.appointments.length;
            const paginatedAppointments = data.appointments.slice(skip, skip + itemsPerPage);

            return res.status(200).json({
                status: true,
                message: "Appointments fetched successfully",
                data: {
                    appointments: paginatedAppointments,
                    totalAppointments: totalAppointments,
                    totalPages: Math.ceil(totalAppointments / itemsPerPage),
                    currentPage: currentPage
                }
            });
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid role specified",
            });
        }
    } catch (error) {
        console.error("Error retrieving appointment data:", error.message);
        return res.status(500).json({
            status: false,
            message: "Error retrieving appointment data",
            error: error.message,
        });
    }
};

export const appointmentUpdateController = async (req, res) => {
    try {
        const { appointmentId, cancellationReason, role, status } = req.body;

        // Create an update object to hold the fields to be updated
        let updateFields = {};

        if (role === "doctor") {
            if (status === 'canceled') {
                updateFields = {
                    status: 'canceled',
                    isCanceled: true,
                    cancellationReason: cancellationReason,
                    canceledBy: role
                };
            } else if (status) {
                updateFields = { status: status };
            }
        } else if (role === "patient") {
            updateFields = {
                status: 'canceled',
                isCanceled: true,
                cancellationReason: cancellationReason,
                canceledBy: role
            };
        }

        // Perform the update operation
        await AppointmentSchema.findByIdAndUpdate(appointmentId, updateFields, { new: true });

        return res.status(200).json({
            status: true,
            message: "Appointment status updated successfully",
        });
    } catch (error) {
        console.error("Error updating appointment:", error.message);
        return res.status(500).json({
            status: false,
            message: "Error updating appointment",
            error: error.message,
        });
    }
};










