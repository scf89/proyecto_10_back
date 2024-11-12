const User = require('../models/User');
const Event = require('../models/Event');

const addAttendeeToEvent = async (req, res) => {
  try {
    const { id } = req.params; // ID del evento
    const userId = req.user._id; // ID del usuario autenticado

    // Buscar el evento y verificar existencia
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Verificar si el usuario ya es asistente del evento
    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: 'Ya eres asistente de este evento' });
    }

    // Agregar el usuario al array de asistentes del evento
    event.attendees.push(userId);
    await event.save();

    // Actualizar solo el campo eventsAttending en el usuario
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { eventsAttending: id } }, // Solo agregar el evento
      { new: true, select: '-password' } // Excluir el campo password
    );

    return res.status(200).json(user); // Enviar el usuario actualizado sin el campo password
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al añadir asistente' });
  }
};


const addEventToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { eventId } = req.event._id; // ID del evento a agregar

    // Buscar el usuario por ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el evento ya está en la lista
    if (user.eventsAttending.includes(eventId)) {
      return res.status(400).json({ message: 'El usuario ya está inscrito en este evento' });
    }

    // Añadir el evento al array de eventsAttending del usuario
    user.eventsAttending.push(eventId);

    // Guardar el usuario actualizado
    await user.save();

    // Responder con el usuario actualizado
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al agregar evento al usuario:', error);
    res.status(500).json({ message: 'Hubo un error al agregar el evento al usuario' });
  }
};

const removeAttendee = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user._id; // El ID del usuario que está haciendo la solicitud

  try {
    // 1. Eliminar el ID del usuario de la lista de asistentes del evento
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Verificar si el usuario está en la lista de asistentes
    const indexInEvent = event.attendees.indexOf(userId);
    if (indexInEvent === -1) {
      return res.status(400).json({ message: "El usuario no está en la lista de asistentes" });
    }

    // Eliminar al usuario de la lista de asistentes
    event.attendees.splice(indexInEvent, 1);
    await event.save();

    // 2. Eliminar el ID del evento de la lista de eventos del usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const indexInUser = user.eventsAttending.indexOf(eventId);
    if (indexInUser === -1) {
      return res.status(400).json({ message: "El evento no está en la lista de eventos del usuario" });
    }

    // Eliminar el evento de la lista de eventos a los que el usuario asiste
    user.eventsAttending.splice(indexInUser, 1);
    await user.updateOne({ eventsAttending: user.eventsAttending });

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la asistencia" });
  }
};


module.exports = {
  addAttendeeToEvent,
  removeAttendee
};
