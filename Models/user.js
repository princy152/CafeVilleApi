const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
    // unique : true
  },
  mobile: {
    type: String,
    default: null,
    // unique : true
  },
  status: {
    type: Number,
    default: 0, // 0- Inactive, 1- Active
  },
  password: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: null,
  },
  creditAmount: {
    type: Number,
    default: 0,
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

userSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model("User", userSchema);
