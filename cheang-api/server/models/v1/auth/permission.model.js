import mongoose from "mongoose";
import MongooseDocument, {
  basicMethods,
  basicStatics,
  excludeDeletedMiddleware,
} from "../../basic.model.js";

const permissionSchema = new mongoose.Schema(
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
    ...MongooseDocument,
  },
  { timestamps: true }
);

permissionSchema.index({
  name: "text",
  description: "text",
});

// Add common methods
Object.assign(permissionSchema.methods, basicMethods);

// Add common static methods
Object.assign(permissionSchema.statics, basicStatics);

// Add query middleware to auto-exclude deleted documents
permissionSchema.pre(/^find/, excludeDeletedMiddleware);

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;
