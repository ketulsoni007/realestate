import { Router } from "express";
import { validate } from "../../middleware/Validate.js";
import { verifyAdminToken } from "../../middleware/verifyAdminToken.js";
import { stateDetailController, stateListController, stateStoreController, stateUpdateController,stateDeleteController, stateDropdownController } from "../../controllers/adminController/adminStateController.js";
import { adminStateValidationRules } from "../../validation/adminValidation/stateAdminValidation.js";

const adminStateRoute = Router();

adminStateRoute.post("/store",adminStateValidationRules,validate,verifyAdminToken,stateStoreController)
adminStateRoute.get("/view",verifyAdminToken,stateListController)
adminStateRoute.get("/detail/:id",verifyAdminToken,stateDetailController)
adminStateRoute.post("/update/:id",adminStateValidationRules,validate,verifyAdminToken,stateUpdateController)
adminStateRoute.delete("/delete",verifyAdminToken,stateDeleteController)
adminStateRoute.get("/dropdown",verifyAdminToken,stateDropdownController)

export default adminStateRoute;