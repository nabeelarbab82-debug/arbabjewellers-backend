// models/blog.js
const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  name: String,
  description: String,
  title1: String,
  heading1: String,
  title2: String,
  heading2: String,
  title3: String,
  heading3: String,
  title4: String,
  heading4: String,
  title5: String,
  heading5: String,
  title6: String,
  heading6: String,
  title7: String,
  heading7: String,
  title8: String,
  heading8: String,
  title9: String,
  heading9: String,
  title10: String,
  heading10: String,
  imageUrl: String,
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
