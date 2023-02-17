const mongoose = require("mongoose");


const tableSchema = new mongoose.Schema({
    username: { type: String, required: false },
    table: { type: String, required: false },
    order: { type: String, required: false },
    price: { type: String, required: false },
    time: { type: String, required: false },
    status: { type: String, required: false },
    IDrestaurant:{ type: String, required: false },
  }, {timestamps : true});

const tableModel = mongoose.model("tables", tableSchema);


module.exports = tableModel;