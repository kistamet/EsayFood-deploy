const express = require("express");
const menuItemModel = require("../models/menuItemModel");
const router = express.Router();



router.get("/get-all-items", async (req, res) => {
    try {
        const items = await menuItemModel.find();
        res.send(items);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching items.' });
    }
});

router.post("/add-item", async (req, res) => {
    try {
        
        const menuItems_name = req.body.name;
        const menuItems_price = req.body.price;
        const menuItems_category = req.body.category;
        const menuItems_image = req.body.image;
        const menuItems_stock = req.body.stock;
        const menuItems_IDrestaurant = req.body.Idrestaurant;

        const newitem = new menuItemModel({ 
            name: menuItems_name , 
            price: menuItems_price ,
            category: menuItems_category,
            image: menuItems_image,
            stock: menuItems_stock,
            IDrestaurant : menuItems_IDrestaurant
        })
        await newitem.save()
        res.send('Item added successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/edit-item", async (req, res) => {
    try {
        await menuItemModel.findOneAndUpdate({_id : req.body.itemId} , req.body)
        res.send('Item updated successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/delete-item", async (req, res) => {
    try {
        await menuItemModel.findOneAndDelete({_id : req.body.itemId})
        res.send('Item delete successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/update-stock", async (req, res) => {
    try {
        await menuItemModel.findOneAndUpdate({_id : req.body.itemId ,stock : req.body.stock})
        res.send('Update stock successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});
module.exports = router;