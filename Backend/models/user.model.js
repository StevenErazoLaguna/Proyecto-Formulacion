const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // admin, rrhh, contador, etc
  company: String,
  avatar: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
