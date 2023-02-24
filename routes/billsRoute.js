const express = require("express");
const BillModel = require("../models/billModel");
const orderModel = require("../models/orderModel");

const router = express.Router();

router.post("/charge-bill", async (req, res) => {
    try {
      const newbill = new BillModel({
        customerName: req.body.customerName,
        customerPhoneNumber: req.body.customerPhoneNumber,
        totalAmount: req.body.totalAmount,
        table: req.body.table,
        subTotal: req.body.subTotal,
        paymentMode: req.body.paymentMode,
        cartItems: req.body.cartItems,
        IDrestaurant:req.body.Idrestaurant,
      });
      await newbill.save();
      res.send('Bill charged successfully' );
    } catch (error) {
      res.status(400).json(error);
    }
  });
router.get("/get-all-bills", async (req, res) => {
    try {
        const bills = await BillModel.find();
        res.send(bills);
    } catch (error) {
        res.status(400).json(error);
    }
});
router.get("/get-all-order", async (req, res) => {
  try {
      const orders = await orderModel.find();
      res.send(orders);
  } catch (error) {
      res.status(400).json(error);
  }
});
router.post("/bill-order", async (req, res) => {
  try {
    const neworder = new orderModel({
      customerName: req.body.customerName,
      status: req.body.status,
      price: req.body.price,
      quantity: req.body.quantity,
      table: req.body.table,
      order: req.body.order,
      time: req.body.time,
      IDrestaurant:req.body.Idrestaurant,
    });
    await neworder.save();
    res.send('Bill charged successfully' );
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/bill-order-update", async (req, res) => {
  try {
      await orderModel.findOneAndUpdate({_id : req.body.orderId} , req.body)
      res.send('Order delete successfull')
  } catch (error) {
      res.status(400).json(error);
  }
});
module.exports = router;