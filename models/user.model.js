const mongoose 	= require('mongoose')
const crypto 		= require('crypto')
const uniqueValidator = require('mongoose-unique-validator')
const dbConfig 	= require('../config/database')
const jwt 			= require('jsonwebtoken')
let Schema 			= mongoose.Schema

const UserSchema = new Schema({
	username: {type: String, trim: true, required: [true,'please provide username']},
	email: {
		type: String,
		lowercase: true,
		required: true,
		unique: true,
		match: [ /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, 'The email provided ({VALUE}) is invalid!']
	},
	password: { type: String, trim: true},
	salt: { type: String, trim: true },
	contacts: [{ type: Schema.Types.ObjectId, ref: 'Contact' }]
}, {timestamps: true, strict: true})

let validatePassword = function(password){
	var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
	return this.password === hash
}

let generateJWT = function(){
	var today = new Date()
	var exp = new Date(today)
	exp.setDate(today.getDate() + 60)

	return jwt.sign({
		id: this._id,
		username: this.username,
		exp: parseInt(exp.getTime() / 1000)
	}, dbConfig.secret)
}

let toAuthJSON = function(){
	return {
		username: this.username,
		email: this.email,
		token: this.generateJWT()
	}}

UserSchema.pre('save', async function save(next) {
	if (!this.isModified('password')) return next()
	try {
		this.salt = crypto.randomBytes(16).toString('hex')
		this.password = crypto.pbkdf2Sync(this.password, this.salt, 10000, 512, 'sha512').toString('hex')
		return next()
	} catch (err) {
		return next(err)
	}
})

UserSchema.methods.validatePassword = validatePassword
UserSchema.methods.generateJWT = generateJWT
UserSchema.methods.toAuthJSON = toAuthJSON

UserSchema.plugin(uniqueValidator, {message: 'expected {PATH} to be unique.'})

module.exports = mongoose.model('User', UserSchema)
