const express = require('express');
const { createEvent, getEvents } = require('../controllers/eventController');
const { isAuth, isAdmin } = require('../../middlewares/auth');
const {upload} = require('../../middlewares/file');

const router = express.Router();

router.post('/', [isAuth, upload.single('image')], createEvent);
router.get('/', getEvents);

module.exports = router;
