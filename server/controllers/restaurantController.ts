import { Request, Response } from "express";
import Restaurant from "../models/Restaurant.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Booking from "../models/Booking.js";

// Get all restaurants
// /api/restaurants
export const getRestaurants = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { search, priceRange, rating, location, sort } = req.query;

    const queryObj: any = { status: "approved" };
    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (priceRange) {
      const prices = Array.isArray(priceRange) ? priceRange : [priceRange];
      queryObj.priceRange = { $in: prices };
    }
    if (rating) {
      queryObj.rating = { $gte: parseFloat(rating as string) };
    }
    if (location) {
      queryObj.location = { $regex: location as string, $options: "i" };
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === "rating") {
      sortOption = { rating: -1 };
    } else if (sort === "price_low") {
      sortOption = { priceRange: 1 };
    } else if (sort === "price_high") {
      sortOption = { priceRange: -1 };
    }

    const restaurants = await Restaurant.find(queryObj).sort(sortOption);
    res.status(200).json(restaurants);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single restaurant by ID
// /api/restaurants/:id
export const getRestaurantById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }
    res.status(200).json(restaurant);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get featured and exclusive restaurants
// GET /api/restaurants/featured
export const getFeaturedRestaurants = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurants = await Restaurant.find({
      status: "approved",
      $or: [{ featured: true }, { exclusive: true }],
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(restaurants);
  } catch (error: any) {
    console.error("Get featured restaurants error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single restaurant by slug
// GET /api/restaurants/:slug
export const getRestaurantBySlug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug });
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    if (restaurant.status !== "approved") {
      let isAuthorized = false;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        try {
          const token = req.headers.authorization.split(" ")[1];
          const decoded: any = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
          };

          const user = await User.findById(decoded.id);
          if (
            user &&
            (user.role === "admin" ||
              (user.role === "owner" &&
                restaurant.owner.toString() === user._id.toString()))
          ) {
            isAuthorized = true;
          }
        } catch (err) {
          res.status(401).json({ message: "Not authorized, invalid token" });
          return;
        }
        if (!isAuthorized) {
          res
            .status(403)
            .json({ message: "Restaurant not found or pending approval" });
          return;
        }
      }
    }

    res.status(200).json(restaurant);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get dynamic seat availability for slots
// /api/restaurants/:id/availability
export const getRestaurantAvailability = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { date } = req.query;
    if (!date) {
      res.status(400).json({ message: "please provide a date" });
      return;
    }
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    const bookingDate = new Date(date as string);
    const bookings = await Booking.find({
      restaurant: restaurant._id,
      date: bookingDate,
      status: "confirmed",
    });

    const availablity = restaurant.availableSlots.map((slot) => {
      const bookedSeats = bookings
        .filter((booking) => booking.time === slot)
        .reduce((sum, b) => sum + b.guests, 0);
      const totalSeats = restaurant.totalSeats || 20;
      const availableSeats = Math.max(0, totalSeats - bookedSeats);
      return {
        time: slot,
        availableSeats,
        isAvailable: availableSeats > 0,
      };
    });

    res.status(200).json(availablity);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
