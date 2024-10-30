import { Router } from "express";
import { validate } from "../../middleware/Validate.js";
import { verifyAdminToken } from "../../middleware/verifyAdminToken.js";
import { adminAreaValidationRules } from "../../validation/adminValidation/areaAdminValidation.js";
import { areaDeleteController, areaDetailController, areaDropdownController, areaListController, areaStoreController, areaUpdateController } from "../../controllers/adminController/adminAreaController.js";

const adminAreaRoute = Router();

adminAreaRoute.post("/store",adminAreaValidationRules,validate,verifyAdminToken,areaStoreController)
adminAreaRoute.get("/view",verifyAdminToken,areaListController)
adminAreaRoute.get("/detail/:id",verifyAdminToken,areaDetailController)
adminAreaRoute.post("/update/:id",adminAreaValidationRules,validate,verifyAdminToken,areaUpdateController)
adminAreaRoute.delete("/delete",verifyAdminToken,areaDeleteController)
adminAreaRoute.get("/dropdown",verifyAdminToken,areaDropdownController)

export default adminAreaRoute;