const express = require('express');
const {
  registerUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
} = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/get-all-users', getAllUser);
router.get('/get-user/:id', getUser);
router.delete('/delete-user/:id', deleteUser);
router.put('/update-user/:id', updateUser);
module.exports = router;
