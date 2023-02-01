const mongoose = require("mongoose");


const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: false },
    price: { type: Number, required: false },
    category: { type: String, required: false },
    image: { type: String, required: false },
    stock: { type: Number, required: false },
    namerestaurant:[{type: mongoose.Schema.Types.ObjectId, ref: 'restaurants'}],
  }, {timestamps : true});

const menuItemModel = mongoose.model("menuitems", menuItemSchema);


module.exports = menuItemModel;