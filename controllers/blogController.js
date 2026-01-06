const Blog = require("../models/blogModel"); // Adjust the path to your blog model

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve blogs",
      error: error.message,
    });
  }
};

// Add a new blog
exports.addBlog = async (req, res) => {
  try {
    const {
      name,
      description,
      imageUrl,
      title1,
      heading1,
      title2,
      heading2,
      title3,
      heading3,
      title4,
      heading4,
      title5,
      heading5,
      title6,
      heading6,
      title7,
      heading7,
      title8,
      heading8,
      title9,
      heading9,
      title10,
      heading10,
    } = req.body;
    const blog = new Blog({
      name,
      description,
      imageUrl,
      title1,
      heading1,
      title2,
      heading2,
      title3,
      heading3,
      title4,
      heading4,
      title5,
      heading5,
      title6,
      heading6,
      title7,
      heading7,
      title8,
      heading8,
      title9,
      heading9,
      title10,
      heading10,
    });
    await blog.save();
    res.status(201).json({
      message: "Blog added successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add blog",
      error: error.message,
    });
  }
};
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params; // Extract blog id from the request parameters

    // Find the blog by id and delete it
    const blog = await Blog.findByIdAndDelete(id);

    // Check if the blog exists
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json({
      message: "Blog deleted successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { _id } = req.params; // Get the blog ID from the route parameters
    const {
      name,
      description,
      imageUrl,
      title1,
      heading1,
      title2,
      heading2,
      title3,
      heading3,
      title4,
      heading4,
      title5,
      heading5,
      title6,
      heading6,
      title7,
      heading7,
      title8,
      heading8,
      title9,
      heading9,
      title10,
      heading10,
    } = req.body; // Get the updated blog data from the request body

    // Find the blog by its ID and update it
    const updatedBlog = await Blog.findByIdAndUpdate(
      _id,
      {
        name,
        description,
        imageUrl,
        title1,
        heading1,
        title2,
        heading2,
        title3,
        heading3,
        title4,
        heading4,
        title5,
        heading5,
        title6,
        heading6,
        title7,
        heading7,
        title8,
        heading8,
        title9,
        heading9,
        title10,
        heading10,
      },
      { new: true } // Return the updated blog document
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog updated successfully",
      updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update blog",
      error: error.message,
    });
  }
};

// Get a blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve blog",
      error: error.message,
    });
  }
};
