import mongoose from "mongoose";
import MongooseDocument, {
  basicMethods,
  basicStatics,
  excludeDeletedMiddleware,
} from "../../basic.model.js";

const categorySchema = new mongoose.Schema(
  {
    nameEn: {
      type: String,
      trim: true,
      required: true,
    },
    nameKh: {
      type: String,
      trim: true,
      required: true,
    },
    nameZh: {
      type: String,
      trim: true,
      required: true,
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

// 
categorySchema.index({
  nameEn: "text",
  nameKh: "text",
  nameZh: "text",
  description: "text",
});

// Add common methods
Object.assign(categorySchema.methods, basicMethods);

// Add common static methods
Object.assign(categorySchema.statics, basicStatics);

// Add query middleware to auto-exclude deleted documents
categorySchema.pre(/^find/, excludeDeletedMiddleware);

const Category = mongoose.model("Category", categorySchema);

export default Category;
