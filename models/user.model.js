const mongoose 	= require('mongoose')
const crypto 		= require('crypto')
let Schema 			= mongoose.Schema

const UserSchema = new Schema({
	username: {type: String, trim: true, required: [true,'please provide last name']},
	email: {
		type: String,
		lowercase: true,
		required: true,
		unique: true,
		match: [ /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, 'The email provided ({VALUE}) is invalid!']
	},
	password: { type: String, required: true, match: [/^[a-zA-Z0-9]{3,30}$/, 'Password is required!']},
	salt: { type: String, trim: true }
}, {timestamps: true})

let setPassword = (password) => {
	try{
		this.salt = crypto.randomBytes(16).toString('hex')
		this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
		return true
	}catch(ex){
		return ex
	}
}

let validatePassword = (password) => {
	var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
	return this.password === hash
}

let getUserByEmail = (username, cb) => {
	const query = { username: username }
	this.findOne(query, cb)
}

UserSchema.methods.setPassword = setPassword
UserSchema.methods.validatePassword = validatePassword
UserSchema.methods.getUserByEmail = getUserByEmail

module.exports = mongoose.model('User', UserSchema)
