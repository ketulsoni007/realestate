import { Router } from "express";
import { validate } from "../../middleware/Validate.js";
import { verifyAdminToken } from "../../middleware/verifyAdminToken.js";
import { adminModuleValidationRules } from "../../validation/adminValidation/moduleAdminValidation.js";
import { moduleDeleteController, moduleDetailController, moduleDropdownController, moduleListController, moduleStoreController, moduleUpdateController,moduleSidebarController,modulePermissionListController } from "../../controllers/adminController/adminModuleController.js";

const adminModuleRoute = Router();

adminModuleRoute.post("/store",adminModuleValidationRules,validate,verifyAdminToken,moduleStoreController)
adminModuleRoute.get("/view",verifyAdminToken,moduleListController)
adminModuleRoute.get("/detail/:id",verifyAdminToken,moduleDetailController)
adminModuleRoute.post("/update/:id",adminModuleValidationRules,validate,verifyAdminToken,moduleUpdateController)
adminModuleRoute.delete("/delete",verifyAdminToken,moduleDeleteController)
adminModuleRoute.get("/dropdown",verifyAdminToken,moduleDropdownController)
adminModuleRoute.get("/sidebar",verifyAdminToken,moduleSidebarController)
adminModuleRoute.get("/permission/list",verifyAdminToken,modulePermissionListController)

export default adminModuleRoute;