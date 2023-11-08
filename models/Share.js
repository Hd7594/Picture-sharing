const mongoose = require("mongoose");

const Share = mongoose.model("Share", {
  name: String,
  author: String,
  description: String,
  category: String,
  picture: Object,
});

module.exports = Share;
