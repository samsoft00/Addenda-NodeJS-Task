const mongoose = require('mongoose')
let Schema = mongoose.Schema

const ContactSchema = new Schema({
	first_name: { type: String, trim: true, required: [true,'please provide first name']},
	last_name: { type: String, trim: true, required: [true,'please provide last name']},
	phone_number: { type: String, trim: true},
	street: {type: String,trim: true},
	city: {type: String,trim: true},
	state: {type: String,trim: true},
	country: {type: String,trim: true},
	postal_code: {type: String,trim: true},
	user: { type: Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true, strict: true})

module.exports = mongoose.model('Contact', ContactSchema)
