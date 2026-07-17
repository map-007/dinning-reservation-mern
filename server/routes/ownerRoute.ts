import { Router } from "express";
import {
  getOwnersRestaurant,
  createOwnersRestaurant,
  updateOwnersRestaurant,
  getOwnerBookings,
  updateBookingStatus,
} from "../controllers/ownerController.js";
import upload from "../config/multer.js";
import { protect, ownerOnly } from "../middlewares/auth.js";

const ownerRouter = Router();
ownerRouter.use(protect);
ownerRouter.use(ownerOnly);

ownerRouter.get("/restaurant", getOwnersRestaurant);
ownerRouter.post("/restaurant", upload.single("image"), createOwnersRestaurant);
ownerRouter.put("/restaurant", upload.single("image"), updateOwnersRestaurant);
ownerRouter.get("/bookings", getOwnerBookings);
ownerRouter.put("/bookings/:id/status", updateBookingStatus);

export default ownerRouter;
