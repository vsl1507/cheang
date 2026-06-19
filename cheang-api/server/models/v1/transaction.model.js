import mongoose from "mongoose";
import MongooseDocument, { basicMethods, basicStatics, excludeDeletedMiddleware } from "../basic.model.js";

const transactionSchema = new mongoose.Schema(
  {
    ...MongooseDocument,
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "ABA", "Stripe"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    transactionRef: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

transactionSchema.methods = { ...basicMethods };
transactionSchema.statics = { ...basicStatics };
transactionSchema.pre(/^find/, excludeDeletedMiddleware);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
