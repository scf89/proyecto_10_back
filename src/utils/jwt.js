const jwt = require("jsonwebtoken");

// Generar JWT
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1y' });

// esta función me sirve para comprobar si la llave la hemos hecho nosotros
const verifyJwt = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}


module.exports = { generateToken, verifyJwt }