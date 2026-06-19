import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Serivce from "../models/service.model.js";
import SupportMessage from "../models/supportMessage.model.js";
import Review from "../models/review.model.js";
import Save from "../models/save.model.js";
import { errorHandler } from "../utils/error.js";
import { ObjectId } from "mongoose";

export const populateUserCommentsAndSaves = async (userDoc) => {
  if (!userDoc) return null;
  const userObj = userDoc.toObject ? userDoc.toObject() : userDoc;
  const userId = userObj._id;

  const reviews = await Review.find({ handyman: userId })
    .populate("client", "nameuser avatar")
    .sort({ createdAt: -1 });

  const formattedRatings = reviews.map(r => ({
    _id: r._id,
    userRate: r.client ? r.client._id.toString() : "",
    rating: r.rating
  }));

  const formattedComments = reviews
    .filter(r => r.comment && r.comment.trim() !== "")
    .map(r => ({
      _id: r._id,
      userComment: r.client ? r.client._id.toString() : "",
      userName: r.client ? r.client.nameuser : "",
      userAvatar: r.client ? r.client.avatar : "",
      comment: r.comment,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    }));

  const saves = await Save.find({ userSaver: userId })
    .populate("userSaved", "nameuser avatar");

  const formattedSaves = saves.map(s => ({
    _id: s._id,
    userId: s.userSaved ? s.userSaved._id.toString() : "",
    userName: s.userSaved ? s.userSaved.nameuser : "",
    userAvatar: s.userSaved ? s.userSaved.avatar : "",
    saveSign: s.saveSign,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt
  }));

  userObj.ratings = formattedRatings;
  userObj.comments = formattedComments;
  userObj.saves = formattedSaves;

  return userObj;
};

export const test = async (req, res) => {
  res.status(201).json("User created successfully");
};

//With token
export const getAllUserAc = async (req, res, next) => {
  try {
    const currentUserID = req.user.id;
    console.log(currentUserID);
    const users = await User.find({
      _id: { $ne: currentUserID },
      userPro: true,
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          nameuser: req.body.nameuser,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
          brandName: req.body.brandName,
          province: req.body.province,
          city: req.body.city,
          mainService: req.body.mainService,
          subService: req.body.subService,
          phone: req.body.phone,
          Request: req.body.Request,
          Confirm: req.body.Confirm,
          userPro: req.body.userPro,
        },
      },
      { new: true }
    );

    const populatedUser = await populateUserCommentsAndSaves(updatedUser);
    const { password, ...rest } = populatedUser;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const ratingUser = async (req, res, next) => {
  const { rating } = req.body;
  const client = req.user.id;
  const handyman = req.params.id;

  try {
    await Review.findOneAndUpdate(
      { client, handyman },
      { $set: { rating } },
      { upsert: true, new: true }
    );

    const userBeingRated = await User.findById(handyman);
    const populatedUser = await populateUserCommentsAndSaves(userBeingRated);
    const { password, ...rest } = populatedUser;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const commentUser = async (req, res, next) => {
  const { comment } = req.body;
  const client = req.user.id;
  const handyman = req.params.id;
  try {
    await Review.findOneAndUpdate(
      { client, handyman },
      { $set: { comment } },
      { upsert: true, new: true }
    );

    const userBeingCommented = await User.findById(handyman);
    const populatedUser = await populateUserCommentsAndSaves(userBeingCommented);
    const { password, ...rest } = populatedUser;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteCommentUser = async (req, res, next) => {
  const { commentId } = req.params;
  const userId = req.body.user;

  try {
    await Review.findByIdAndDelete(commentId);

    const user = await User.findById(userId);
    const populatedUser = await populateUserCommentsAndSaves(user);
    const { password, ...rest } = populatedUser;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const saveUser = async (req, res, next) => {
  const { userId } = req.params;
  const userSaver = req.user.id;
  try {
    const existingSave = await Save.findOne({ userSaver, userSaved: userId });
    
    if (existingSave) {
      await Save.deleteOne({ _id: existingSave._id });
    } else {
      await Save.create({
        userSaver,
        userSaved: userId,
        saveSign: true
      });
    }

    const userToSave = await User.findById(userSaver);
    const populatedUser = await populateUserCommentsAndSaves(userToSave);
    const { password, ...rest } = populatedUser;

    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || "";
    const locations = req.query.locations || "location";
    const order = req.query.order || "desc";
    const currentUserID = req.user.id;
    const users = await User.find({
      _id: { $ne: currentUserID },
      nameuser: { $regex: searchTerm, $options: "i" },
      userPro: true,
    })
      .sort({ [locations]: order })
      .limit(limit)
      .skip(startIndex);
    console.log(users);
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const liveSearch = async (req, res, next) => {
  try {
    console.log("work");
    const { mainService, subService, province, city } = req.query;
    // const { mainService, subService, province, city } = req.body;

    console.log(subService);
    // Create a query object based on the search parameters
    const liveSearchQuery = {
      userPro: true,
      admin: false,
      mainService: mainService,
      subService: subService,
      province: province,
      city: city,
    };

    // Use your User model to find users based on the liveSearchQuery
    const liveSearchResults = await User.find(liveSearchQuery);

    res.json(liveSearchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

///Without Token
export const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find({
      userPro: true,
    });
    return res.status(200).json(users);
    console.log(users);
  } catch (error) {
    next(error);
  }
};

///to admin
export const updateUserPro = async (req, res, next) => {
  try {
    // console.log(req.params.id);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          Request: req.body.Request,
          Confirm: req.body.Confirm,
          userPro: req.body.userPro,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const countUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    const populatedUsers = await Promise.all(
      users.map(u => populateUserCommentsAndSaves(u))
    );
    return res.status(200).json(populatedUsers);
  } catch (error) {
    next(error);
  }
};

/////////////////////////////////
////////////////////////////////
//////////////////////////////

export const getUserService = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const service = await Serivce.find({ userRef: req.params.id });
      res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own service!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const id = req.params.id;
    console.log(id);
    if (!user) {
      return next(errorHandler(404, "Listing not found!"));
    }
    const populatedUser = await populateUserCommentsAndSaves(user);
    res.status(200).json(populatedUser);
  } catch (error) {
    next(error);
  }
};

export const getServiceUser = async (req, res, next) => {
  if (req.params.id) {
    try {
      const service = await Serivce.find({ userRef: req.params.id });
      res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own service!"));
  }
};

export const getUserno = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const id = req.params.id;
    console.log(id);
    if (!user) {
      return next(errorHandler(404, "Listing not found!"));
    }
    const populatedUser = await populateUserCommentsAndSaves(user);
    res.status(200).json(populatedUser);
  } catch (error) {
    next(error);
  }
};

// Create a support ticket
export const createSupportMessage = async (req, res, next) => {
  const { name, email, topic, message } = req.body;
  if (!name || !email || !topic || !message) {
    return next(errorHandler(400, "All fields are required."));
  }
  try {
    const newMessage = await SupportMessage.create({
      name,
      email,
      topic,
      message,
    });
    return res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};
