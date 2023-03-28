const mongoose = require("mongoose");
const fs = require("fs");

// Connect to your MongoDB database
mongoose.connect("mongodb://localhost/my_database", { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for your image data
const imageSchema = new mongoose.Schema({
  imageData: Buffer,
});

// Create a new model based on the schema
const Image = mongoose.model("Image", imageSchema);

// Read the image file into a Buffer
const imageBuffer = fs.readFileSync("/path/to/image.jpg");

// Create a new document and save it to the database
const newImage = new Image({ imageData: imageBuffer });
newImage.save((err) => {
  if (err) throw err;
  console.log("Image saved to MongoDB!");
});