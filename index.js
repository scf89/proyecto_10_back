require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/api/routes/userRoutes');
const eventRoutes = require('./src/api/routes/eventRoutes');
const eventuserRoutes = require('./src/api/routes/eventuserRoutes');

const app = express();

const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como herramientas de prueba)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/eventuser',eventuserRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
