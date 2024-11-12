const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    rol: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    eventsAttending: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Método para encriptar la contraseña antes de guardarla
userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);
