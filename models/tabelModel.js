const mongoose = require("mongoose");


const tebelSchema = new mongoose.Schema({
    username: { type: String, required: false },
    tabel: { type: String, required: false },
    items: { type: String, required: false },
    price: { type: String, required: false },
    people: { type: String, required: false },
    time: { type: Number, required: false },
    status: { type: String, required: false },
    IDrestaurant:{ type: String, required: false },
  }, {timestamps : true});

const menuItemModel = mongoose.model("tebel", tebelSchema);


module.exports = menuItemModel;