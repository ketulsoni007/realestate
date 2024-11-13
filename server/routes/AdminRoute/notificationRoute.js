import { Router } from "express";
import { verifyAdminToken } from "../../middleware/verifyAdminToken.js";
import { notificationCountController, notificationListController, notificationViewController } from "../../controllers/adminController/adminNotificationController.js";

const notificationRoute = Router();

notificationRoute.post("/view/:id",verifyAdminToken,notificationViewController);
notificationRoute.get("/list",verifyAdminToken,notificationListController);
notificationRoute.get("/count",verifyAdminToken,notificationCountController);

export default notificationRoute;