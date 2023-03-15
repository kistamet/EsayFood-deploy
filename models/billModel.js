const mongoose = require("mongoose");

const billSchema = mongoose.Schema({
  customerName: { type: String, required: false },
  customerPhoneNumber: { type: String, required: false },
  quantity: { type: Number, required: true },
  table: { type: String, required: false },
  subTotal: { type: Number, required: true },
  paymentMode: { type: String, required: true },
  cartItems: { type: Array, required: true },
  IDrestaurant:{ type: String, required: true },
  timecheckbills:{ type: String, required: true },
  daycheckbills:{ type: String, required: true },
  kind:{ type: String, required: true },
  cash:{ type: String, required: true },
  change: { type: Number, required: true },
}, {
  timestamps : true});

const billModel = mongoose.model("bills", billSchema);

module.exports = billModel;