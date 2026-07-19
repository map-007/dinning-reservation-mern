import { Schema, model, Document, Types } from "mongoose";
import crypto from "crypto";

export interface IBooking extends Document {
  user: Types.ObjectId; // Reference to the User model
  restaurant: Types.ObjectId; // Reference to the Restaurant model
  date: Date;
  time: string;
  guests: number;
  occasion: string;
  specialRequests?: string;
  status: "confirmed" | "cancelled" | "no-show";
  bookingId: string; // Unique booking identifier
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    occasion: {
      type: String,
      required: true,
    },
    specialRequests: {
      type: String,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "no-show"],
      default: "confirmed",
    },
    bookingId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

BookingSchema.pre<IBooking>("save", function () {
  if (!this.bookingId) {
    this.bookingId = `GR-${crypto.randomBytes(4).toString("hex").toUpperCase()}}`;
  }
});

const Booking = model<IBooking>("Booking", BookingSchema);

export default Booking;
