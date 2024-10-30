import { Router } from "express";
import { validate } from "../../middleware/Validate.js";
import { adminLoginValidationRules } from "../../validation/adminValidation/authAdminValidation.js";
import { verifyAdminToken } from "../../middleware/verifyAdminToken.js";
import { adminLoginController, adminLogout, adminProfileUpdateController, adminUserAuthCheck } from "../../controllers/adminController/authAdminController.js";

const adminAuthRoute = Router();

// adminAuthRoute.post("/register",registerController)
adminAuthRoute.post("/login",adminLoginValidationRules,validate,adminLoginController)
adminAuthRoute.put("/update/:id",verifyAdminToken,adminProfileUpdateController)
// adminAuthRoute.get("/roles",getRoleDropdownController)
adminAuthRoute.get("/logout",verifyAdminToken,adminLogout)
adminAuthRoute.get("/session",verifyAdminToken,adminUserAuthCheck)
// adminAuthRoute.get("/test",verifyAdminToken,testController)

export default adminAuthRoute;