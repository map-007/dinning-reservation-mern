import { Router } from "express";
import {
  getOwnersRestaurant,
  createOwnersRestaurant,
  updateOwnersRestaurant,
  getOwnerBookings,
  updateBookingStatus,
} from "../controllers/ownerController.js";
import { uploadRestaurantImage } from "../config/multer.js";
import { protect, ownerOnly } from "../middlewares/auth.js";

const ownerRouter = Router();
ownerRouter.use(protect);
ownerRouter.use(ownerOnly);

ownerRouter.get("/restaurant", getOwnersRestaurant);
ownerRouter.post("/restaurant", uploadRestaurantImage, createOwnersRestaurant);
ownerRouter.put("/restaurant", uploadRestaurantImage, updateOwnersRestaurant);
ownerRouter.get("/bookings", getOwnerBookings);
ownerRouter.put("/bookings/:id/status", updateBookingStatus);

export default ownerRouter;
