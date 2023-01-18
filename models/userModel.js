const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true },
}, {timestamps : true});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;