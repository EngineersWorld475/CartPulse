const express = require('express');
const router = express.Router();
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware');
const {
  createBlog,
  getBlog,
  getAllBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

router.post('/create', authMiddleWare, isAdmin, createBlog);
router.get('/:id', getBlog);
router.get('/', getAllBlog);
router.put('/update/:id', authMiddleWare, isAdmin, updateBlog);
router.delete('/delete/:id', authMiddleWare, isAdmin, deleteBlog);

module.exports = router;
