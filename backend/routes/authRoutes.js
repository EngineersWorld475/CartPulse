const express = require('express');
const {
  registerUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
} = require('../controllers/userController');
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/get-all-users', getAllUser);
router.get('/get-user/:id', authMiddleWare, isAdmin, getUser);
router.delete('/delete-user/:id', authMiddleWare, deleteUser);
router.put('/update-user', authMiddleWare, updateUser);
module.exports = router;
