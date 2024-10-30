import UserSchema from "../models/UserSchema.js";
import DoctorSchema from "../../models/DoctorSchema.js";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import WorkingHourSchema from "../../models/WorkingHourSchema.js";
import EducationSchema from "../../models/EducationSchema.js";
import ExperienceSchema from "../../models/ExperienceSchema.js";
import RatingSchema from "../../models/RatingSchema.js";

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

export const heroDoctorController = async (req, res) => {
    try {
        // Fetch the first 3 doctors, excluding the 'appointments' field
        const doctors = await DoctorSchema.find({})
            .sort({ createdAt: 1 })
            .limit(3)
            .select('-appointments -educations -experiences');
            const testimonials = await RatingSchema.find({ isActive: true })
            // .populate({
            //     path: 'doctor',
            //     select: '-appointments -password -educations -experiences -ratings'
            // })
            .populate({
                path: 'patient',
                select: 'name photo'
            });

        return res.status(200).json({
            status: true,
            message: "Doctor fetched",
            doctors: doctors,
            testimonials:testimonials,
        });
    } catch (error) {
        return res.status(410).json({
            status: false,
            message: "Error fetching doctors",
            error: error.message
        });
    }
};

export const findDoctorController = async (req, res) => {
    try {
        const { keywords, title } = req.query;
        const query = {};
        if (keywords) {
            query.name = { $regex: keywords, $options: 'i' };
        }
        if (title) {
            query.designation = title;
        }
        const doctors = await DoctorSchema.find(query).select('-appointments');
        return res.status(200).json({
            status: true,
            message: "Doctors fetched successfully",
            doctors: doctors
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error fetching doctors",
            error: error.message
        });
    }
};

export const doctorDetailController = async (req, res) => {
    try {
        const { id } = req.params;
        // const doctor = await DoctorSchema.findById({_id:id}).select('-appointments');
        const doctor = await DoctorSchema.findById({ _id: id })
            .populate('workingHours')
            .populate('educations')
            .populate('experiences')
            .populate({
                path: 'ratings',
                match: { isActive: true },
                populate: {
                    path: 'patient',
                    select: '_id name photo',  // Only include _id, name, and photo fields from the patient
                }
            })
            .select('-appointments')
            .lean()
            .exec();

        if (!doctor) {
            return res.status(404).json({
                status: false,
                message: "Doctor not found",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Doctor details fetched successfully",
            doctor: doctor,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error fetching doctor details",
            error: error.message,
        });
    }
};

export const doctorHourController = async (req, res) => {
    try {
        const { workingHours, doctorId } = req.body;
        const parsedWorkingHours = JSON.parse(workingHours);
        const updatedWorkingHours = {};

        // Prepare the updated working hours based on activity
        for (const [day, { open, close, active }] of Object.entries(parsedWorkingHours)) {
            updatedWorkingHours[day] = active ? { open, close } : { open: "", close: "" }; // Clear hours if inactive
        }

        // Find or create a WorkingHours entry for the doctor
        let workingHoursEntry = await WorkingHourSchema.findOne({ doctor: doctorId });

        if (workingHoursEntry) {
            // Update existing WorkingHour entry
            workingHoursEntry.hours = updatedWorkingHours;
            await workingHoursEntry.save();
        } else {
            // Create new WorkingHour entry
            workingHoursEntry = new WorkingHourSchema({
                doctor: doctorId,
                hours: updatedWorkingHours,
            });
            await workingHoursEntry.save();
        }

        // Update Doctor schema to reference the WorkingHour entry
        await DoctorSchema.findByIdAndUpdate(
            doctorId,
            { workingHours: workingHoursEntry._id }, // Ensure this is the reference field in the Doctor schema
            { new: true } // Return the updated document
        );

        // Fetch updated doctor information with populated working hours
        const updatedDoctor = await DoctorSchema.findById(doctorId)
            .populate('workingHours')
            .select('-appointments -educations -experiences')
            .lean()
            .exec();

        if (!updatedDoctor) {
            return res.status(404).json({
                status: false,
                message: "Doctor not found",
            });
        }

        // Send the response with updated doctor information and working hours
        return res.status(200).json({
            status: true,
            message: "Doctor hours updated successfully",
            doctor: updatedDoctor, // Return the doctor with populated working hours
        });
    } catch (error) {
        console.error("Error updating doctor hours:", error.message);
        return res.status(500).json({
            status: false,
            message: "Error updating doctor hours",
            error: error.message,
        });
    }
};


export const doctorExperienceEducationController = async (req, res) => {
    try {
        const { doctorId, education, experience } = req.body;

        if (!doctorId) {
            return res.status(400).json({ status: false, message: "Doctor ID is required" });
        }

        const educationData = JSON.parse(education);
        const experienceData = JSON.parse(experience);

        // Delete existing entries and insert new ones
        await EducationSchema.deleteMany({ doctorId: doctorId });
        const newEducationEntries = await EducationSchema.insertMany(
            educationData.map(item => ({ ...item, doctorId: doctorId }))
        );

        await ExperienceSchema.deleteMany({ doctorId: doctorId });
        const newExperienceEntries = await ExperienceSchema.insertMany(
            experienceData.map(item => ({ ...item, doctorId: doctorId }))
        );

        // Update Doctor schema to reference new education and experience entries
        await DoctorSchema.findByIdAndUpdate(
            doctorId,
            {
                educations: newEducationEntries.map(entry => entry._id),
                experiences: newExperienceEntries.map(entry => entry._id)
            },
            { new: true } // Return the updated document
        );

        // Fetch updated doctor information with populated education and experience
        const updatedDoctor = await DoctorSchema.findById(doctorId)
            .populate('educations') // Populate the education field
            .populate('experiences') // Populate the experience field
            .lean()
            .exec();

        if (!updatedDoctor) {
            return res.status(404).json({
                status: false,
                message: "Doctor not found",
            });
        }

        // Send the response with updated doctor information, education, and experience
        return res.status(200).json({
            status: true,
            message: "Education and Experience updated successfully",
            doctor: updatedDoctor
        });
    } catch (error) {
        console.error("Error updating doctor:", error.message);
        return res.status(500).json({
            status: false,
            message: "Error updating doctor",
            error: error.message,
        });
    }
};

export const doctorExperienceGetController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ status: false, message: "Doctor ID is required" });
        }
        const educationData = await EducationSchema.find({ doctorId: id }).exec();
        const experienceData = await ExperienceSchema.find({ doctorId: id }).exec();

        return res.status(200).json({
            status: true,
            message: "Education and Experience retrieved successfully",
            educationData,
            experienceData
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







