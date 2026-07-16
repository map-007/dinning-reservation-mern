import { Router } from "express";
import {
  getRestaurants,
  getRestaurantById,
  getFeaturedRestaurants,
  getRestaurantAvailability,
  getRestaurantBySlug,
} from "../controllers/restaurantController.js";

const restaurantRouter = Router();

restaurantRouter.get("/", getRestaurants);
restaurantRouter.get("/:id", getRestaurantById);
restaurantRouter.get("/featured", getFeaturedRestaurants);
restaurantRouter.get("/:slug", getRestaurantBySlug);
restaurantRouter.get("/:id/availability", getRestaurantAvailability);

export default restaurantRouter;
