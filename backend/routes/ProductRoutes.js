const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware');

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.put('/update/:id', authMiddleWare, isAdmin, updateProduct);
router.delete('/delete/:id', authMiddleWare, isAdmin, deleteProduct);

module.exports = router;
