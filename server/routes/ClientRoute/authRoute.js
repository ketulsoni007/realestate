import { Router } from "express";
import { loginController, registerController, changePasswordController, profileUpdateController, getRoleDropdownController, testController, logout, userAuthCheck } from "../../controllers/clientController/authController.js";
import { validate } from "../../middleware/Validate.js";
import { verifyClientToken } from "../../middleware/verifyClientToken.js";
import { loginValidationRules } from "../../validation/clientValidation/authValidation.js";

const authRoute = Router();

authRoute.post("/register",registerController)
authRoute.post("/login",loginValidationRules,validate,loginController)
authRoute.get("/roles",getRoleDropdownController)
authRoute.get("/logout",verifyClientToken,logout)
authRoute.get("/check",verifyClientToken,userAuthCheck)
authRoute.get("/test",verifyClientToken,testController)

export default authRoute;