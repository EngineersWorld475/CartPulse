const asyncHandler = require('express-async-handler');
const Blog = require('../models/blogModel');
const mongodbValidateId = require('../utils/mongodbValidateId');

const createBlog = asyncHandler(async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
      throw new Error('All fields are required');
    }
    const newBlog = await new Blog({
      title,
      description,
      category,
    }).save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

const getBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    mongodbValidateId(id);
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      throw new Error('Blog not found');
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

const getAllBlog = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      throw new Error('Blog not found');
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    res.status(200).send(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      throw new Error('Blog not found');
    }
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});
module.exports = { createBlog, getBlog, getAllBlog, updateBlog, deleteBlog };
