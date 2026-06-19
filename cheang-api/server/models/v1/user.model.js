import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nameuser: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    refreshTokens: {
      type: [String],
      default: [],
    },
    admin: {
      type: Boolean,
      default: false,
    },
    Request: { type: Boolean, default: false },
    Confirm: { type: Boolean, default: false },
    userPro: { type: Boolean, default: false },
    brandName: {
      type: String,
      default: "",
    },
    province: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    mainService: {
      type: String,
      default: "",
    },
    subService: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.index({ userPro: 1, province: 1, city: 1, mainService: 1 });

// Add query middleware to auto-populate role and nested permissions
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "role",
    populate: {
      path: "permissions",
      select: "name description",
    },
  });
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
