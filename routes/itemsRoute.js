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

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/') //path where the image will be saved
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) //unique filename for the image
    }
});
const upload = multer({ storage: storage });
router.post("/add-item", upload.single('image'), async (req, res) => {
    try {
        const menuItems_name = req.body.name;
        const menuItems_price = req.body.price;
        const menuItems_category = req.body.category;
        const menuItems_image = req.file.path; // save the path of the uploaded image in DB
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
        res.send('Item added successfully')
    } catch (error) {
        res.status(400).json(error);
    }
});


router.post("/edit-item", upload.single('image'), async (req, res) => {
    try {
      const menuItem = await menuItemModel.findById(req.body.itemId);
      if (!menuItem) {
        return res.status(400).send("Item not found");
      }
      
      let menuItems_image = menuItem.image;
      if (req.file) {
        menuItems_image = req.file.path; // save the path of the uploaded image in DB
      }

      await menuItemModel.findByIdAndUpdate(req.body.itemId, {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        image: menuItems_image,
        Idrestaurant: req.body.Idrestaurant
      });

      res.send('Item updated successfully');
    } catch (error) {
      res.status(400).json(error);
    }
});

router.post("/edit-item-stock", async (req, res) => {
    try {
      await menuItemModel.findOneAndUpdate({ _id: req.body.itemId }, { stock: req.body.stock })
      res.send('Item updated successfully')
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