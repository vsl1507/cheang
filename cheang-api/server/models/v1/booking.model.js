import mongoose from "mongoose";
import MongooseDocument, { basicMethods, basicStatics, excludeDeletedMiddleware } from "../basic.model.js";

const bookingSchema = new mongoose.Schema(
  {
    ...MongooseDocument,
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    handyman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Completed", "Cancelled"],
      default: "Pending",
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      default: "Phnom Penh, Cambodia",
    },
  },
  { timestamps: true }
);

bookingSchema.methods = { ...basicMethods };
bookingSchema.statics = { ...basicStatics };
bookingSchema.pre(/^find/, excludeDeletedMiddleware);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
