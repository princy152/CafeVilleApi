const mongoose = require("mongoose");
Item = require("./item");
const orderSchema = new mongoose.Schema({
  orderNo: {
    type: String,
    default: null,
  },
  billAmount: {
    type: Number,
    default: null,
  },
  orderItem: {
    type: [
      {
        price: {
          type: Number,
          default: null,
        },
        totalPrice: {
          type: Number,
          default: null,
        },
        itemId: {
          type: "ObjectId",
          ref: "Item",
          default: null,
        },
        quantity: {
          type: Number,
          default: null,
        },
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

orderSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model("Order", orderSchema);
