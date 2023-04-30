const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  imgFile: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String },
  phone: { type: String },
  email: { type: String },
  street: { type: String },
  city: { type: String },
  state: { type: String },
});

const Contact = mongoose.model('contact', contactSchema);

module.exports = Contact;
