const express = require("express");
const tableModel = require("../models/tableModel");
const orderModel = require("../models/orderModel");
const router = express.Router();

router.get("/get-all-table", async (req, res) => {
    try {
        const table = await tableModel.find();
        res.send(table);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/add-table", async (req, res) => {
    try {
        const existingTable = await tableModel.findOne({ table: req.body.table });
        if (existingTable) {
            res.status(400).json({ message: "Table already exists" });
        } else {
            const tablerestaurants = new tableModel({
                username: req.body.name,
                table: req.body.table,
                items: req.body.items,
                price: req.body.price,
                people: req.body.people,
                time: req.body.time,
                status: req.body.status,
                IDrestaurant: req.body.Idrestaurant,
                uniqueTableID: req.body.uniqueTableID,
                Link: req.body.Link,
            })
            if (tablerestaurants) {
                res.send({ message: 'Login successfull', tablerestaurants });
                await tablerestaurants.save()
            } else {
                res.status(400).json({ message: "Login fail", });
            }
        }
        } catch (error) {
            res.status(400).json(error);
        }
    });


router.post("/cancel-table", async (req, res) => {
    try {
        await tableModel.findOneAndDelete({ table: req.body.tablenumber })
        await orderModel.findOneAndDelete({ $or: [{ table: req.body.tablenumber }, { customerName: req.body.customerName }]})
        res.send('Table cancel successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});
module.exports = router;