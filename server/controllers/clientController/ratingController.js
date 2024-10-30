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
import RatingSchema from "../../models/RatingSchema.js";

dotenv.config();

export const ratingStoreController = async (req, res) => {
  try {
    const { id, doctor, review, rating } = req.body;

    const existingRating = await RatingSchema.findOne({ patient: id, doctor });
    if (existingRating) {
      return res.status(410).json({
        status: false,
        message:
          "It looks like you've already submitted a rating for this doctor. Thank you for your feedback!",
      });
    }

    // Create a new rating
    const newRating = new RatingSchema({
      patient: id,
      doctor,
      review,
      rating,
      isActive: false,
    });

    const savedRating = await newRating.save();
    await DoctorSchema.findByIdAndUpdate(doctor, {
      $push: { ratings: savedRating._id },
    });

    res.status(200).json({
      status: true,
      message: "Rating submitted successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(422).json({
        status: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }

    console.error("Error creating rating:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
