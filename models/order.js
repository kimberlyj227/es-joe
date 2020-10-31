const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CartItemSchema = new mongoose.Schema({
  name: String, 
  price: Number,
  count: Number,
  product: {
    type: ObjectId,
    ref: "Product"
  }
}, 
{timestamps: true}
);

const CartItem = mongoose.model("CartItem", CartItemSchema);

const OrderSchema = new mongoose.Schema(
  {
    products: [CartItemSchema],
    transaction_id: {},
    amount: Number,
    address: String,
    status: {
      type: String,
      default: "Not processed",
      enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"]
    },
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User"
  }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", OrderSchema)

module.exports = {CartItem, Order}


