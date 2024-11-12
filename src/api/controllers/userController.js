const User = require('../models/User');
const { generateToken } = require("../../utils/jwt");
const bcrypt = require('bcrypt');



// Registrar usuario
const registerUser = async (req, res) => {
  const { userName, email, password} = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ userName, email, password });
  res.status(201).json({ token: generateToken(user._id) });
};

// Login usuario
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id);
    return res.status(200).json({ token, user })
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// Listar usuarios (solo admin)
const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// Cambiar rol de un usuario (solo admin)
const changeUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  // Verifica que el rol sea válido
  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ message: 'Rol no válido' });
  }
  // Verifica que el usuario que realiza la acción sea un admin
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
  }

  const user = await User.findByIdAndUpdate(userId, { rol: role }, { new: true });
  
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  
  res.json({ message: 'Rol cambiado exitosamente', user });
};

// Eliminar usuario (admin o self)
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  // Verifica si el usuario es un admin o si está eliminando su propia cuenta
  if (req.user.rol === 'admin' || req.user._id.toString() === userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.json({ message: 'Usuario eliminado exitosamente' });
  }

  return res.status(403).json({ message: 'No tienes permisos para eliminar este usuario' });
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("eventsAttending");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json("error");
  }
};

// Función para agregar un evento al usuario
const addEventToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { eventId } = req.body; // ID del evento a agregar

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



module.exports = { registerUser, loginUser, getAllUsers, changeUserRole, deleteUser, getUserById, addEventToUser };
