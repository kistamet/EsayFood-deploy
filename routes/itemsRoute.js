const express = require("express");
const ItemModel = require("../models/itemsModel");
const menuItemModel = require("../models/menuItemModel");
const restaurantModel = require("../models/restaurantModel");

restaurantModel
const router = express.Router();

router.get("/get-all-items", async (req, res) => {
    try {
        const items = await menuItemModel.find();
        res.send(items);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/add-item", async (req, res) => {
    try {
        const newitem = new menuItemModel(req.body)
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
        await ItemModel.findOneAndDelete({_id : req.body.itemId})
        res.send('Item delete successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});
module.exports = router;