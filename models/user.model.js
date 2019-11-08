const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {type: String, trim: true, required: [true,'please provide last name']},
  email: {
    type: String,
    lowercase: true,
    required: 'required',
    match: [ /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, "The email provided ({VALUE}) is invalid!"]
  },
  password: { type: String, trim: true},
  updated_at: {type: Date, default: Date.now()},
  created_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Contact', UserSchema);
