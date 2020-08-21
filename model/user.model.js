const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      minlength: 5,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    profilePicture: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: Number, //1 for admin,2 for normal user,3 visitors
      default: 2,
      enum: [1, 2],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },
    updatedBy: "string",
    address: {
      permanent_address: String,
      temporary_address: [String],
    },
    cart: {
      type: Array,
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

const NewUser = mongoose.model("User", UserModel);

module.exports = NewUser;
