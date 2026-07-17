import {
  getAllRestaurants,
  getAdminStats,
  approveRestaurant,
} from "../controllers/adminController.js";
import { Router } from "express";
import { protect, adminOnly } from "../middlewares/auth.js";

const adminRouter = Router();
adminRouter.use(protect);
adminRouter.use(adminOnly);

adminRouter.get("/restaurants", getAllRestaurants);
adminRouter.get("/stats", getAdminStats);
adminRouter.put("/restaurants/:id/approve", approveRestaurant);

export default adminRouter;
