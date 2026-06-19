import mongoose from "mongoose";
import MongooseDocument, { basicMethods, basicStatics, excludeDeletedMiddleware } from "../basic.model.js";

const serviceSchema = new mongoose.Schema(
  {
    ...MongooseDocument,
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://static-00.iconduck.com/assets.00/wrench-icon-2047x2048-jyerjpd9.png",
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

serviceSchema.methods = { ...basicMethods };
serviceSchema.statics = { ...basicStatics };
serviceSchema.pre(/^find/, excludeDeletedMiddleware);

const Serivce = mongoose.model("Serivce", serviceSchema);

export default Serivce;
