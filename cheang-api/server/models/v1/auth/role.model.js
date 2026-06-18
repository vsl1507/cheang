import mongoose from "mongoose";
import MongooseDocument, {
  basicMethods,
  basicStatics,
  excludeDeletedMiddleware,
} from "../../basic.model.js";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      required: false,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    ...MongooseDocument,
  },
  { timestamps: true }
);

roleSchema.index({
  name: "text",
  description: "text",
});

// Add common methods
Object.assign(roleSchema.methods, basicMethods);

// Add common static methods
Object.assign(roleSchema.statics, basicStatics);

// Add query middleware to auto-exclude deleted documents
roleSchema.pre(/^find/, excludeDeletedMiddleware);

const Role = mongoose.model("Role", roleSchema);

export default Role;
