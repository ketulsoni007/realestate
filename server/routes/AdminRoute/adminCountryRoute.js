import { Router } from "express";
import { validate } from "../../middleware/Validate.js";
import { verifyAdminToken } from "../../middleware/verifyAdminToken.js";
import { countryDetailController, countryListController, countryStoreController, countryUpdateController,countryDeleteController,countryDropdownController } from "../../controllers/adminController/adminCountryController.js";
import { adminCountryValidationRules } from "../../validation/adminValidation/countryAdminValidation.js";

const adminCountryRoute = Router();

adminCountryRoute.post("/store",adminCountryValidationRules,validate,verifyAdminToken,countryStoreController)
adminCountryRoute.get("/view",verifyAdminToken,countryListController)
adminCountryRoute.get("/detail/:id",verifyAdminToken,countryDetailController)
adminCountryRoute.post("/update/:id",adminCountryValidationRules,validate,verifyAdminToken,countryUpdateController)
adminCountryRoute.delete("/delete",verifyAdminToken,countryDeleteController)
adminCountryRoute.get("/dropdown",verifyAdminToken,countryDropdownController)

export default adminCountryRoute;