const express = require("express");
const restaurantModel = require("../models/restaurantModel");
const menuItemModel = require("../models/menuItemModel");
const router = express.Router();

router.post("/loginRestaurant", async (req, res) => {
    try {
        const user = await restaurantModel.findOne({
            restaurantId: req.body.restaurantId,
            restaurantpassword: req.body.restaurantpassword,
            verified: true
        })
        if (user) {
            res.send('Login successfull')
        } else {
            res.status(400).json({ message: "Login fail", user });
        }
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/RegisterRestaurant", async (req, res) => {
    try {
        const menuItems_name = req.body.name;
        const menuItems_price = req.body.price;
        const menuItems_category = req.body.category;

        const newMenu = new menuItemModel({ 
            name: menuItems_name , 
            price: menuItems_price ,
            category: menuItems_category
        });
        await newMenu.save();
        const newuser = new restaurantModel({ 
            namerestaurant: req.body.namerestaurant, 
            restaurantId: req.body.restaurantId,
            restaurantpassword: req.body.restaurantpassword,
            verified: false });
        newuser.menu.push({
            menuId: newMenu._id,
            name: menuItems_name,
            price: menuItems_price,
            category: menuItems_category
        });
        await newuser.save();
        res.send("User Registered successfully");
    } catch (error) {
        res.status(400).json(error);
    }
});


module.exports = router;