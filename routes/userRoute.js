const express = require("express");
const UserModel = require("../models/userModel");
const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const user = await UserModel.findOne({
            userId: req.body.userId,
            password: req.body.password,
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
router.post("/register", async (req, res) => {
    try {
        const existingUser = await UserModel.findOne({userId: req.body.userId});
        if (existingUser) {
            res.status(400).json({ message: "UserId already exists"});
        } else {
            const newuser = new UserModel({...req.body, verified:false});
            await newuser.save();
            res.send("User registered successfully");
        }
    } catch (error) {
        res.status(400).json(error);
    }
});











module.exports = router;