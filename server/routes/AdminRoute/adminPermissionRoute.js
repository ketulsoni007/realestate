import { Router } from "express";
import { validate } from "../../middleware/Validate.js";
import { verifyAdminToken } from "../../middleware/verifyAdminToken.js";
import { adminSubModuleValidationRules } from "../../validation/adminValidation/subModuleAdminValidation.js";
import { roleListController, roleStoreController,permissionStoreController,roleDropdownController,roleUpdateController,roleDeleteController } from "../../controllers/adminController/adminPermissionController.js";

const adminPermissionRoute = Router();

adminPermissionRoute.get("/list",verifyAdminToken,roleListController)
adminPermissionRoute.get("/dropdown",verifyAdminToken,roleDropdownController)
adminPermissionRoute.post("/store",verifyAdminToken,permissionStoreController)
adminPermissionRoute.put("/role/update/:roleId",verifyAdminToken,roleUpdateController)
adminPermissionRoute.post("/role/store",verifyAdminToken,roleStoreController)
adminPermissionRoute.delete("/role/delete",verifyAdminToken,roleDeleteController)
// adminPermissionRoute.get("/postman",roleStoreController)

export default adminPermissionRoute;