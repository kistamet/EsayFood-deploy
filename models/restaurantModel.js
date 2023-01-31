const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    namerestaurant: { type: String, required: true } ,
    restaurantId: { type: String, required: true },
    restaurantpassword: { type: String, required: true },
    menu: [{
        menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'menuitems' },
        name: String,
        price: Number,
        category: String
    }],
  }, {timestamps : true});
  
  const restaurantModel = mongoose.model("restaurants", restaurantSchema);



module.exports = restaurantModel 