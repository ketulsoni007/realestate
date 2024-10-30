import { Router } from "express";
import { validate } from "../../middleware/Validate.js";
import { verifyAdminToken } from "../../middleware/verifyAdminToken.js";
import { adminCityValidationRules } from "../../validation/adminValidation/cityAdminValidation.js";
import { cityDeleteController, cityDetailController, cityListController, cityStoreController, cityUpdateController,cityDropdownController } from "../../controllers/adminController/adminCityController.js";

const adminCityRoute = Router();

adminCityRoute.post("/store",adminCityValidationRules,validate,verifyAdminToken,cityStoreController)
adminCityRoute.get("/view",verifyAdminToken,cityListController)
adminCityRoute.get("/detail/:id",verifyAdminToken,cityDetailController)
adminCityRoute.post("/update/:id",adminCityValidationRules,validate,verifyAdminToken,cityUpdateController)
adminCityRoute.delete("/delete",verifyAdminToken,cityDeleteController)
adminCityRoute.get("/dropdown",verifyAdminToken,cityDropdownController)

export default adminCityRoute;