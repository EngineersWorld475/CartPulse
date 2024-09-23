const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Product = require('../models/productModel');
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { title, description, price, category, brand, quantity, color } =
      req.body;
    if (!title || !description || !price || !category || !brand || !quantity) {
      throw new Error('All fields are required');
    }
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await new Product({ ...req.body }).save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // This line converts the query parameters' comparison operators (gte, gt, lte, lt) to MongoDB’s query operators ($gte, $gt, $lte, $lt). MongoDB uses $ prefixes for these operators, so this replacement ensures that the query string is in the correct format for MongoDB.
    console.log(JSON.parse(queryStr));
    let query = Product.find(JSON.parse(queryStr));

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      console.log(fields);
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error('This page does not exists');
    }
    const product = await query;
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

const getProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product is not found');
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, brand, quantity, color } =
      req.body;
    if (!title || !description || !price || !category || !brand || !quantity) {
      throw new Error('All fields are required');
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, {
      $set: {
        title,
        description,
        price,
        category,
        brand,
        quantity,
      },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
