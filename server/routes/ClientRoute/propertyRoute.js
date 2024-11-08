import { Router } from "express";
import { propertyListController,propertyCategoryController, propertyFeaturedController,propertySearchController,propertyFilterController,propertyDetailController,propertyContactController } from "../../controllers/clientController/propertyController.js";

const authRoute = Router();

authRoute.get("/list",propertyListController)
authRoute.get("/categories",propertyCategoryController)
authRoute.get("/featured",propertyFeaturedController)
authRoute.get("/search",propertySearchController)
authRoute.get("/detail/:id",propertyDetailController)
authRoute.post("/filter",propertyFilterController)
authRoute.post("/contact",propertyContactController)

export default authRoute;