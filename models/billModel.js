const mongoose = require("mongoose");

const billSchema = mongoose.Schema({
  customerName: { type: String, required: false },
  customerPhoneNumber: { type: String, required: false },
  quantity: { type: Number, required: false },
  table: { type: String, required: false },
  subTotal: { type: Number, required: true },
  paymentMode: { type: String, required: false },
  cartItems: { type: Array, required: false },
  IDrestaurant:{ type: String, required: true },
  timecheckbills:{ type: String, required: false },
  daycheckbills:{ type: String, required: false },
  kind:{ type: String, required: false },
}, {timestamps : true});

const billModel = mongoose.model("bills", billSchema);

module.exports = billModel;