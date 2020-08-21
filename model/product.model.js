const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productModel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: Number,
    description: String,
    category: String,
    brand: String,
    weight: Number,
    manuDate: String,
    tags: [String],
    image: [String],
    discountedItem: Boolean,
    discountType: String,
    discountValue: Number,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("product", productModel);

module.exports = Product;
