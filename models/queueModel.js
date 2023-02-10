const mongoose = require("mongoose");

const queuerestaurantSchema = new mongoose.Schema({
    Queue: { type: String, required: false } ,
    name: { type: String, required: true } ,
    quantity: { type: String, required: true },
    details: { type: String, required: true },
    IDrestaurant:{ type: String, required: false },
  }, {timestamps : true});
  
  const queuerestaurantModel = mongoose.model("queuerestaurants", queuerestaurantSchema);

module.exports = queuerestaurantModel 