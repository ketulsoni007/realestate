import { Router } from "express";
import { validate } from "../../middleware/Validate.js";
import { verifyAdminToken } from "../../middleware/verifyAdminToken.js";
import { subModuleDeleteController, subModuleDetailController, subModuleDropdownController, subModuleListController, subModuleStoreController, subModuleUpdateController } from "../../controllers/adminController/adminSubModuleController.js";
import { adminSubModuleValidationRules } from "../../validation/adminValidation/subModuleAdminValidation.js";

const adminSubModuleRoute = Router();

adminSubModuleRoute.post("/store",adminSubModuleValidationRules,validate,verifyAdminToken,subModuleStoreController)
adminSubModuleRoute.get("/view",verifyAdminToken,subModuleListController)
adminSubModuleRoute.get("/detail/:id",verifyAdminToken,subModuleDetailController)
adminSubModuleRoute.post("/update/:id",adminSubModuleValidationRules,validate,verifyAdminToken,subModuleUpdateController)
adminSubModuleRoute.delete("/delete",verifyAdminToken,subModuleDeleteController)
adminSubModuleRoute.get("/dropdown",verifyAdminToken,subModuleDropdownController)

export default adminSubModuleRoute;