const express = require("express");
const queueModel = require("../models/queueModel");
const router = express.Router();

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
            details: req.body.details,
            IDrestaurant: req.body.Idrestaurant,
            Queue: req.body.Queue,
        })
        if (queuerestaurants) {
            res.send({ message: 'Login successfull', queuerestaurants });
            await queuerestaurants.save()
        } else {
            res.status(400).json({ message: "Login fail", });
        }
    } catch (error) {
        res.status(400).json(error);
    }
});
router.post("/edit-queue", async (req, res) => {
    try {
        await queueModel.findOneAndUpdate({ _id: req.body.queueId }, req.body)
        res.send('Item updated successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/delete-queue", async (req, res) => {
    try {
        await queueModel.findOneAndDelete({ _id: req.body.queueId })
        res.send('Queue delete successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;