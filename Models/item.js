const mongoose = require("mongoose");
Size = require("./size");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  subTypeId: {
    type: "ObjectId",
    ref: "Size",
    default: null,
  },
  price: {
    type: Number,
    default: null,
  },
  type: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

itemSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model("Item", itemSchema);
