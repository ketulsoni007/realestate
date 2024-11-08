import { Router } from "express";
import { profileWishListStoreController } from "../../controllers/clientController/profileController.js";

const authRoute = Router();

// authRoute.get("/list",propertyListController)
authRoute.post("/wishlist/store",profileWishListStoreController)

export default authRoute;