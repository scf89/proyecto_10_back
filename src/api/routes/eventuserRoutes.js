const express = require('express');
const { addAttendeeToEvent, removeAttendee } = require('../controllers/eventuserController');
const { isAuth } = require('../../middlewares/auth'); // Asegúrate de que la autenticación esté funcionando

const router = express.Router();

router.patch('/:id/attendees', isAuth, addAttendeeToEvent);
router.delete("/:eventId/attendees", isAuth, removeAttendee);

module.exports = router;
