import { Router } from "express";
import { validate } from "../../middleware/Validate.js";
import { adminLoginValidationRules } from "../../validation/adminValidation/authAdminValidation.js";
import { verifyAdminToken } from "../../middleware/verifyAdminToken.js";
import { propertyStoreController, propertyUpdateController,propertyListController,propertyDetailController,propertyExportController, propertyExampleController,propertyDeleteController, propertyImportController,propertyFeatureUpdateController } from "../../controllers/adminController/adminPropertyController.js";

const adminPropertyRoute = Router();

adminPropertyRoute.post("/store",verifyAdminToken,propertyStoreController)
adminPropertyRoute.get("/view",verifyAdminToken,propertyListController)
adminPropertyRoute.get("/detail/:id",verifyAdminToken,propertyDetailController)
adminPropertyRoute.post("/update/:id",verifyAdminToken,propertyUpdateController)
adminPropertyRoute.delete("/delete",verifyAdminToken,propertyDeleteController)
adminPropertyRoute.get("/export",verifyAdminToken,propertyExportController)
adminPropertyRoute.get("/example",verifyAdminToken,propertyExampleController)
adminPropertyRoute.post("/import",verifyAdminToken,propertyImportController)
adminPropertyRoute.post("/feature",verifyAdminToken,propertyFeatureUpdateController)

export default adminPropertyRoute;