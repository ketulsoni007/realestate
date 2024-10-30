import { Router } from "express";
import { accessPannelUpdateController } from "../../controllers/adminController/adminAccessPannelController.js";

const adminAccessRoute = Router();

// adminAccessRoute.get("/list",adminAccess)
// adminAccessRoute.get("/store",accessPannelStoreController)
adminAccessRoute.put("/update/:id",accessPannelUpdateController)

export default adminAccessRoute;