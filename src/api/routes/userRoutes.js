const express = require('express');
const { registerUser, loginUser, getAllUsers, changeUserRole, deleteUser, getUserById, addEventToUser } = require('../controllers/userController');
const { isAdmin, isAuth} = require('../../middlewares/auth');
const router = express.Router();
const { upload } = require('../../middlewares/file');

router.post('/register', upload.none(), registerUser);
router.post('/login', loginUser);
router.patch('/:userId/role', [isAuth, isAdmin], changeUserRole);
router.delete('/:userId', isAuth, deleteUser);
router.get("/:userId", isAuth, getUserById);
router.get('/', [isAuth, isAdmin], getAllUsers);
router.patch('/:userId/events', isAuth, addEventToUser);

module.exports = router;
