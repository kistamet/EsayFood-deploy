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
        tax: req.body.tax,
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

router.post("/bill-order", async (req, res) => {
  try {
    const neworder = new orderModel(req.body);
    await neworder.save();
    res.send('Bill charged successfully' );
  } catch (error) {
    res.status(400).json(error);
  }
});
module.exports = router;