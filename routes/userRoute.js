const express = require("express");
const UserModel = require("../models/userModel");
const router = express.Router();

router.post("/login", async (req, res) => {
    try {
    await UserModel.findOne({userid : req.body.userid, password : req.body.password, verified:true})
        res.send('Login successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});
router.post("/register", async (req, res) => {
    try {
        const newuser = new ItemModel(req.body)
        await newuser.save()
        res.send('User regisered successfull')
    } catch (error) {
        res.status(400).json(error);
    }
});











module.exports = router;