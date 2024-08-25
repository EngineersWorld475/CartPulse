const express = require('express');
const {
  registerUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  getRefreshToken,
  logout,
} = require('../controllers/userController');
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/get-all-users', getAllUser);
router.get('/refresh-token', getRefreshToken);
router.get('/logout', logout);
router.get('/get-user/:id', authMiddleWare, isAdmin, getUser);
router.delete('/delete-user/:id', authMiddleWare, deleteUser);
router.put('/update-user', authMiddleWare, updateUser);
router.put('/block-user/:id', authMiddleWare, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleWare, isAdmin, unblockUser);
router.put('/unblock-user/:id', authMiddleWare, isAdmin, unblockUser);

module.exports = router;
