require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/api/routes/userRoutes');
const eventRoutes = require('./src/api/routes/eventRoutes');
const eventuserRoutes = require('./src/api/routes/eventuserRoutes');

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('api/users', userRoutes);
app.use('api/events', eventRoutes);
app.use('api/eventuser',eventuserRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
