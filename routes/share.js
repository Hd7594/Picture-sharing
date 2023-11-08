const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileUpload = require("express-fileupload");

const Share = require("../models/Share");

const convertToBase64 = require("../utils/convertToBase64");

router.post("/share/add", fileUpload(), async (req, res) => {
  try {
    const { name, author, description, category } = req.body;
    const picture = req.files.picture;
    const fullPicture = await cloudinary.uploader.upload(
      convertToBase64(picture)
    );

    const newShare = new Share({
      name: name,
      author: author,
      description: description,
      category: category,
      picture: fullPicture,
    });
    console.log(newShare);
    await newShare.save();
    res.json(newShare);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/share/list", async (req, res) => {
  try {
    /*
    const shareList = await Share.find();
    res.json(shareList);
    */
    const oneShare = await Share.findById(req.query.id);
    if (req.query.id) {
      res.json(oneShare);
    } else {
      res.json({ message: "bad request" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/share/delete", async (req, res) => {
  await Share.findByIdAndDelete(req.body.id);
  if (req.body.id) {
    res.json({ message: "share successfully deleted" });
  } else {
    res.json({ message: "missing id" });
  }
});

module.exports = router;
