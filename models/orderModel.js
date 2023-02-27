const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    customerName: { type: String, required: false },
    table: { type: String, required: false },
    order: { type: String, required: false },
    price: { type: Number, required: false },
    quantity: { type: Number, required: false },
    subTotal: { type: Number, required: false },
    detail: { type: String, required: false },
    status: { type: String, required: false },
    time: { type: String, required: false },
    IDrestaurant:{ type: String, required: false },
    ObjectIdItem:{ type: String, required: false },
  }, {timestamps : true});

const ordersModel = mongoose.model("orders", orderSchema);

module.exports = ordersModel;