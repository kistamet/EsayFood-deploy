const express = require("express");
const restaurantModel = require("../models/restaurantModel");
const menuItemModel = require("../models/menuItemModel");
const queueModel = require("../models/queueModel");
const tableModel = require("../models/tableModel");
const BillModel = require("../models/billModel");

const router = express.Router();

//login
router.post("/loginRestaurant", async (req, res) => {
    try {
        const restaurant = await restaurantModel.findOne({
            restaurantId: req.body.restaurantId,
            restaurantpassword: req.body.restaurantpassword,
            verified: true
        })
        if (restaurant) {
            res.send({ message: 'Login successfull', restaurant, menu: restaurant.menu });
        } else {
            res.status(400).json({ message: "Login fail", restaurant });
        }
    } catch (error) {
        res.status(400).json(error);
    }
});

//Register
router.post("/RegisterRestaurant", async (req, res) => {
    try {
        const existingUser = await restaurantModel.findOne({ restaurantId: req.body.restaurantId });
        if (existingUser) {
            res.status(400).json({ message: "Restaurant ID already exists" });
        } else {
            const menuItems_name = req.body.name;
            const menuItems_price = req.body.price;
            const menuItems_category = req.body.category;
            const menuItems_IDrestaurant = req.body.restaurantId;
            
            const newMenu = new menuItemModel({
                name: menuItems_name,
                price: menuItems_price,
                category: menuItems_category,
                IDrestaurant: menuItems_IDrestaurant
            });
            const newuser = new restaurantModel({
                namerestaurant: req.body.namerestaurant,
                restaurantId: req.body.restaurantId,
                restaurantpassword: req.body.restaurantpassword,
                verified: false
            });
            newuser.menu.push({
                menuId: newMenu._id,
                name: menuItems_name,
                price: menuItems_price,
                category: menuItems_category
            });
            await newuser.save();
            res.send("User Registered successfully");
        }
    } catch (error) {
        res.status(400).json(error);
    }
});


module.exports = router;
