import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./routes/ClientRoute/authRoute.js";
import propertyRoute from "./routes/ClientRoute/propertyRoute.js";
import profileRoute from "./routes/ClientRoute/profileRoute.js";
import adminAuthRoute from "./routes/AdminRoute/adminAuthRoute.js";
import adminPropertyRoute from "./routes/AdminRoute/adminPropertyRoute.js";
import adminCountryRoute from "./routes/AdminRoute/adminCountryRoute.js";
import adminStateRoute from "./routes/AdminRoute/adminStateRoute.js";
import adminCityRoute from "./routes/AdminRoute/adminCityRoute.js";
import adminAreaRoute from "./routes/AdminRoute/adminAreaRoute.js";
import adminModuleRoute from "./routes/AdminRoute/adminModuleRoute.js";
import adminSubModuleRoute from "./routes/AdminRoute/adminSubModuleRoute.js";
import adminPermissionRoute from "./routes/AdminRoute/adminPermissionRoute.js";
import adminAccessRoute from "./routes/AdminRoute/adminAccessRoute.js";
import notificationRoute from "./routes/AdminRoute/notificationRoute.js";


const app = express();
const corsOption = {
    origin: true,
}
app.get("/",(req,res)=>{
    res.send("Api is in working conditions")
})
dotenv.config();
connectDB();
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors(corsOption));

//Frontend Apis
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/property", propertyRoute);
app.use("/api/v1/profile", profileRoute);
//Admin Apis
app.use("/api/v1/admin/auth", adminAuthRoute);
app.use("/api/v1/admin/property", adminPropertyRoute);
app.use("/api/v1/admin/country", adminCountryRoute);
app.use("/api/v1/admin/state", adminStateRoute);
app.use("/api/v1/admin/city", adminCityRoute);
app.use("/api/v1/admin/area", adminAreaRoute);
app.use("/api/v1/admin/module", adminModuleRoute);
app.use("/api/v1/admin/submodule", adminSubModuleRoute);
app.use("/api/v1/admin/permission", adminPermissionRoute);
app.use("/api/v1/admin/access", adminAccessRoute);
app.use("/api/v1/admin/notification", notificationRoute);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
