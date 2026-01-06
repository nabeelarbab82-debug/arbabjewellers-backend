const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  addBlog,
  // updateBlogByName,
  // updateBlogById,
  updateBlog,
  getBlogById,
  deleteBlog,
} = require("../controllers/blogController"); // Adjust the path to your blog controller

router.get("/getAllBlogs", getAllBlogs);
router.post("/add", addBlog);
//  router.put("/update/:name", updateBlogByName);
router.put("/updateBlog/:_id", updateBlog);
router.get("/blogsbyId/:id", getBlogById);
router.delete("/deleteblog/:id", deleteBlog);

module.exports = router;
