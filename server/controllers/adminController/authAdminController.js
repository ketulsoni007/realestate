import User from "../../models/User.js";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import Role from "../../models/Role.js";
import UserSession from "../../models/UserSession.js";
import AdminPanelAccess from "../../models/AdminPannelAccess.js";

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

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
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

// export const registerController = async (req, res) => {
//   // console.log(req.body);
//   // return res.status(410).json({
//   //   message: "Invalid role",
//   // });
//   upload.single("profile_picture")(req, res, async (err) => {
//     if (err) {
//       return res.status(410).json({
//         status: false,
//         message: err?.message || "Error uploading file",
//         error: err.message,
//       });
//     }
//     try {
//       const file = req.file;
//       const imagePath = file ? file.filename : null;
//       const { first_name, last_name, email, password, phone_number, security_question, role, agency_name, commission_rate, license_number } = req.body;
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(410).json({
//           message: "Email already in use",
//         });
//       }
//       const salt = await bcrypt.genSalt(10);
//       const hashPassword = await bcrypt.hash(password, salt);
//       const roleData = await Role.findOne({ _id: role });
//       if (!roleData) {
//         return res.status(410).json({
//           message: "Invalid role",
//         });
//       }
//       const newUser = new User({
//         first_name,
//         last_name,
//         email,
//         password: hashPassword,
//         security_question,
//         phone_number,
//         role,
//         profile_picture: imagePath,
//       });
//       if (roleData.name === "broker") {
//         newUser.agency_name = agency_name;
//         newUser.commission_rate = commission_rate;
//         newUser.license_number = license_number;
//       }
//       const savedUser = await newUser.save();
//       const token = generateJWT(savedUser);
//       await UserSession.create({
//         user: savedUser._id,
//         token,
//         panel:'client',
//         is_active: true,
//         expired_at: new Date(Date.now() + 3600000),
//       });
//       const responseData = {
//         ...savedUser.toObject(),
//         password: undefined,
//       };

//       res.status(200).json({
//         status: true,
//         user: responseData,
//         token,
//       });
//     } catch (error) {
//       console.log("Error creating user:", error);
//       res.status(500).json({
//         message: "Internal server error",
//       });
//     }
//   });
// };

export const adminLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // const hasAccess = ["66ed5dc893048a3dada991a1","66ed5dc893048a3dada991a2","66ed5dc893048a3dada991b2","66ed5dc893048a3dada991a7","66ed5dc893048a3dada991ad"];
    const accessibleRoles = await AdminPanelAccess.find({ access: true }).select('role');
    const accessibleRoleIds = accessibleRoles.map(access => access.role);
    //Admin
    //Real Estate Broker: Brokers often manage multiple agents and have access to various administrative functions related to property transactions.
    //Real Estate Developer: Developers might need access to manage property listings, user roles, and other administrative tasks related to development projects.
    //Property Manager: Property managers often oversee property operations and may need admin-level access to manage properties, tenants, and other aspects of property management.
    //Leasing Agent: Leasing agents may need some admin functionalities to manage lease agreements and tenant information.
    // const user = await User.findOne({ email,role: { $in: hasAccess } }).populate({
    const user = await User.findOne({ email, role: { $in: accessibleRoleIds } })
      .populate({
        path: 'role',
        select: 'name purpose'
      })
      .select('_id first_name last_name license_number phone_number profile_picture  agency_name commission_rate email password');
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
    await UserSession.deleteMany({ user: user._id, panel: 'admin' });
    const token = generateJWT(user);
    await UserSession.create({
      user: user._id,
      panel: 'admin',
      token,
      is_active: true,
      expired_at: new Date(Date.now() + 86400000), // 1-hour expiration
    });
    const userData = user.toObject();
    delete userData.password;
    res.status(200).json({
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Error while logging in:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const adminLogout = async (req, res) => {
  try {
    const userId = req.userId;
    await UserSession.deleteMany({ user: userId, panel: 'admin', });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const adminUserAuthCheck = async (req, res) => {
  try {
    const userId = req.userId;
    const userSession = await UserSession.findOne({ user: userId, is_active: true, panel: 'admin' });
    if (!userSession) {
      return res.status(410).json({ success: false, message: "Active session not found" });
    }
    res.status(200).json({ message: "Auth check successfully" });
  } catch (error) {
    console.error("Error checking auth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const adminProfileUpdateController = async (req, res) => {
  const { id } = req.params;

  // Multer middleware for single image upload
  upload.single("profile_picture")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: false,
        message: err?.message || "Error uploading file",
        error: err.message,
      });
    }

    try {
      const user = await User.findById(id).populate({
        path: 'role',
        select: 'name purpose'
      }).select('_id first_name last_name license_number phone_number profile_picture agency_name commission_rate email');;

      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }

      const { first_name, last_name, email, phone_number, agency_name, commission_rate, license_number, old_profile_picture } = req.body;
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(410).json({
          status: false,
          message: "Email already in use",
        });
      }
      // Update user fields
      user.first_name = first_name;
      user.last_name = last_name;
      user.email = email;
      user.phone_number = phone_number;
      user.agency_name = agency_name;
      user.commission_rate = commission_rate;
      user.license_number = license_number;

      // Check if a new profile image is uploaded
      if (req.file) {
        // Delete the old profile picture from the file system if it exists
        if (user.profile_picture && user.profile_picture !== old_profile_picture) {
          const oldImagePath = path.join('public/images/user', user.profile_picture);
          fs.unlink(oldImagePath, (err) => {
            if (err) console.log(`Error deleting old profile image: ${err}`);
          });
        }

        // Save new profile picture
        user.profile_picture = req.file.filename;
      }

      // Save updated user data
      await user.save();

      res.status(200).json({
        status: true,
        message: "User profile updated successfully",
        user: user,
      });
    } catch (error) {
      console.log("Error updating user profile:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  });
};

export const adminChangePasswordController = async (req, res) => {
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

export const adminGetRoleDropdownController = async (req, res) => {
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


export const adminTestController = async (req, res) => {
  return res.status(200).json({ message: 'Access Succesfull' });
}
