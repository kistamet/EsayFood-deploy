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
        const existingTable = await tableModel.findOne({ table: req.body.table, IDrestaurant: req.body.Idrestaurant });
        if (existingTable) {
            res.status(400).json({ message: "Table already exists for this restaurant" });
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
                res.send({ message: 'Table added successfully', tablerestaurants });
                await tablerestaurants.save()
            } else {
                res.status(400).json({ message: "Failed to add table", });
            }
        }
    } catch (error) {
        res.status(400).json(error);
    }
});
router.post("/add-table-active", async (req, res) => {
    try {
        await tableModel.findOneAndUpdate(
            { table: req.body.table,  IDrestaurant: req.body.Idrestaurant},
            {
                $set: {
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
                }
            }
        );
        res.send('table updated successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});


router.post("/cancel-table", async (req, res) => {
    try {
        await tableModel.findOneAndUpdate(
            { table: req.body.table,  IDrestaurant: req.body.Idrestaurant},
            {
                $set: {
                    table: req.body.table,
                    items: "",
                    time: req.body.time,
                    status: "Non active",
                    IDrestaurant: req.body.Idrestaurant,
                    uniqueTableID: "",
                    Link: "",
                }
            }
        );
        await orderModel.findOneAndDelete({ $or: [{ table: req.body.tablenumber }, { customerName: req.body.customerName }] })
        res.send('Table cancel successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/update-table", async (req, res) => {
    try {
        await tableModel.findOneAndUpdate(
            { _id: req.body.tableId },
            { $set: { status: req.body.status } }
        );
        res.send('table updated successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/Delete-table", async (req, res) => {
    try {
        await tableModel.findOneAndDelete(
            { table: req.body.table,}
        );
        res.send('table Delete successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});
module.exports = router;