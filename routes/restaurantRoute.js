const express = require("express");
const restaurantModel = require("../models/restaurantModel");
const menuItemModel = require("../models/menuItemModel");
const queueModel = require("../models/queueModel");

const router = express.Router();

router.post("/loginRestaurant", async (req, res) => {
    try {
        const restaurant = await restaurantModel.findOne({
            restaurantId: req.body.restaurantId,
            restaurantpassword: req.body.restaurantpassword,
            verified: true
        })
        if (restaurant) {
            res.send({ message: 'Login successfull', restaurant ,menu: restaurant.menu });
        } else {
            res.status(400).json({ message: "Login fail", restaurant });
        }
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/RegisterRestaurant", async (req, res) => {
    try {
        const existingUser = await restaurantModel.findOne({restaurantId: req.body.restaurantId});
        if (existingUser) {
            res.status(400).json({ message: "Restaurant ID already exists"});
        } else {
        const menuItems_name = req.body.name;
        const menuItems_price = req.body.price;
        const menuItems_category = req.body.category;
        const menuItems_IDrestaurant = req.body.restaurantId;

        const newMenu = new menuItemModel({ 
            name: menuItems_name , 
            price: menuItems_price ,
            category: menuItems_category,
            IDrestaurant : menuItems_IDrestaurant
        });
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
    }
    } catch (error) {
        res.status(400).json(error);
    }
});
router.get("/get-all-queue", async (req, res) => {
    try {
        const queue = await queueModel.find();
        res.send(queue);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/add-queuerestaurants", async (req, res) => {
    try {
        const queuerestaurants = new queueModel({ 
            name: req.body.name,
            quantity: req.body.quantity,
            details:req.body.details,
            IDrestaurant:req.body.Idrestaurant
        })
        if (queuerestaurants) {
            res.send({ message: 'Login successfull' , queuerestaurants});
            await queuerestaurants.save()
        } else {
            res.status(400).json({ message: "Login fail",  });
        }
    } catch (error) {
        res.status(400).json(error);
    }
});
router.post("/edit-queue", async (req, res) => {
    try {
        await queueModel.findOneAndUpdate({_id : req.body.queueId} , req.body)
        res.send('Item updated successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/delete-queue", async (req, res) => {
    try {
        await queueModel.findOneAndDelete({_id : req.body.queueId})
        res.send('Queue delete successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});
module.exports = router;
