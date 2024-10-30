import User from "../../models/User.js";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import Role from "../../models/Role.js";
import UserSession from "../../models/UserSession.js";

dotenv.config();

const generateJWT = (user) => {
  const payload = {
    _id: user._id,
    role: user.role,
    email: user.email,
  };

  // Only include permissions if the user is an admin
  if (user.role === 'admin') {
    payload.permissions = user.permissions;
    payload.is_superadmin = user.is_superadmin; // Optionally include superadmin flag
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/user");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

export const registerController = async (req, res) => {
  // console.log(req.body);
  // return res.status(410).json({
  //   message: "Invalid role",
  // });
  upload.single("profile_picture")(req, res, async (err) => {
    if (err) {
      return res.status(410).json({
        status: false,
        message: err?.message || "Error uploading file",
        error: err.message,
      });
    }
    try {
      const file = req.file;
      const imagePath = file ? file.filename : null;
      const { first_name, last_name, email, password, phone_number, security_question, role, agency_name, commission_rate, license_number } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(410).json({
          message: "Email already in use",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const roleData = await Role.findOne({ _id: role });
      if (!roleData) {
        return res.status(410).json({
          message: "Invalid role",
        });
      }
      const newUser = new User({
        first_name,
        last_name,
        email,
        password: hashPassword,
        security_question,
        phone_number,
        role,
        profile_picture: imagePath,
      });
      if (roleData.name === "broker") {
        newUser.agency_name = agency_name;
        newUser.commission_rate = commission_rate;
        newUser.license_number = license_number;
      }
      const savedUser = await newUser.save();
      const token = generateJWT(savedUser);
      await UserSession.create({
        user: savedUser._id,
        token,
        panel:'client',
        is_active: true,
        expired_at: new Date(Date.now() + 3600000),
      });
      const responseData = {
        ...savedUser.toObject(),
        password: undefined,
      };

      res.status(200).json({
        status: true,
        user: responseData,
        token,
      });
    } catch (error) {
      console.log("Error creating user:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  });
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(410).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(410).json({
        message: "Incorrect password",
      });
    }

    const token = generateJWT(user);

    // Delete any previous active sessions
    await UserSession.deleteMany({ user: user._id,panel:'client' });

    // Create a new session
    await UserSession.create({
      user: user._id,
      panel:'client',
      token,
      is_active: true,
      expired_at: new Date(Date.now() + 3600000), // 1-hour expiration
    });

    // Convert user to object and remove the password field
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: "Login successful",
      user: userData, // User data without password
      token,
    });
  } catch (error) {
    console.error("Error while logging in:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.userId;
    await UserSession.deleteMany({ user: userId,panel:'client', });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userAuthCheck = async (req, res) => {
  try {
    const userId = req.userId;
    const userSession = await UserSession.findOne({ user: userId, is_active: true,panel:'client' });
    if (!userSession) {
      return res.status(410).json({ message: "Active session not found" });
    }
    res.status(200).json({ message: "Auth check successfully" });
  } catch (error) {
    console.error("Error checking auth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const profileUpdateController = async (req, res) => {
  upload.single("photo")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: false,
        message: err?.message || "Error uploading file",
        error: err.message,
      });
    }

    try {
      const {
        role,
        id,
        name,
        email,
        phone,
        gender,
        designation,
        patientsTreated,
        workLocation,
      } = req.body;
      const file = req.file;
      let user;

      // Fetch user based on role
      if (role === "doctor") {
        user = await DoctorSchema.findById(id);
      } else if (role === "patient") {
        user = await User.findById(id);
      } else {
        return res.status(400).json({
          status: false,
          message: "Invalid role provided",
        });
      }

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }
      let updatedFields = {
        name,
        email,
        phone,
        gender,
        designation,
        patientsTreated,
        workLocation,
      };

      if (file) {
        // Add new photo to the fields to update
        updatedFields.photo = file.filename;

        // Delete the old photo if it exists
        if (user.photo) {
          const oldPhotoPath = path.join("public/images/user", user.photo);
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
          }
        }
      }

      // Update the user profile
      await user.updateOne(updatedFields);

      // Fetch the updated user
      let updatedUser;
      if (role === "doctor") {
        updatedUser = await DoctorSchema.findById(id)
          .select("-appointments -educations -experiences -password")
          .populate("workingHours");
      } else {
        updatedUser = await User.findById(id).select(
          "-appointments -password"
        );
      }

      // Return the updated user in response
      res.status(200).json({
        status: true,
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  });
};

export const changePasswordController = async (req, res) => {
  try {
    const { old_password, password, confirm_password, role, id } = req.body;

    let user;

    // Fetch the user based on role
    if (role === "patient") {
      user = await User.findById(id);
    } else if (role === "doctor") {
      user = await DoctorSchema.findById(id);
    } else {
      return res.status(410).json({
        status: false,
        message: "Invalid role specified",
      });
    }

    if (!user) {
      return res.status(410).json({
        status: false,
        message: "User not found",
      });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(410).json({
        status: false,
        message: "Old password is incorrect",
      });
    }

    // Check if password matches confirm_password
    if (password !== confirm_password) {
      return res.status(410).json({
        status: false,
        message: "New password and confirm password do not match",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error while changing password:", error);
    return res.status(410).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const getRoleDropdownController = async (req, res) => {
  try {
    const Roles = await Role.find({ name: { $ne: "admin" } }).select('_id purpose');
    const RoleArray = Roles.map(role => ({
      value: role._id,
      label: role.purpose,
    }));

    return res.status(200).json(RoleArray);
  } catch (error) {
    console.error("Error while fetching roles:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};


export const testController = async (req, res) => {
  return res.status(200).json({message:'Access Succesfull'});
}

