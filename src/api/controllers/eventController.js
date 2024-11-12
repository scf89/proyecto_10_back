const Event = require('../models/Event');

const createEvent = async (req, res) => {
  const { title, date, description, address } = req.body;
  const location = JSON.parse(req.body.location);
  let image = null;
  try {
    if (req.file) {
      image = req.file.path;
    }
    const event = new Event({
      title,
      date,
      description,
      address,
      location, // Se guarda el objeto parseado
      image,
    });
    const savedEvent = await event.save();
    return res.status(201).json(savedEvent);
  } catch (error) {
    return res.status(500).json("Error creating event");
  }
};


const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('attendees').sort({ date: 1 });;
    return res.json(events);
  } catch (error) {
    return res.status(500).json("Error fetching events");
  }
};




module.exports = {
  createEvent,
  getEvents,
};
