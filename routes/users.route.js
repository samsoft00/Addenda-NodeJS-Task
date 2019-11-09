var express 		= require('express')
var router 			= express.Router()
const _ 				= require('lodash')
const Joi 			= require('@hapi/joi')
const JoiHelper	= require('../helper/joi.helper')
const dbConfig 	= require('../config/database')
const jwt 			= require('jsonwebtoken')
const User 			= require('../models/user.model')

/* POST user login. */
router.post('/login', function(req, res) {

	try {
		const payload = _.pick(req.body, ['email', 'password'])

		const {error, value} = Joi.validate(payload,  JoiHelper.validateLogin())
		if(error) throw new Error(error.message)

		User.findOne({email: value.email}, function(err, user) {
			if(err) throw new Error(err.message)
			if(user === null) throw new Error('Invalid credentials')

			if(!user.validatePassword(value.password)){
				throw new Error('Invalid credentials')
			}

			const token = jwt.sign(user, dbConfig.secret, {expiresIn: 604800})
			return res.status(200).json({token})
		})

	} catch (error) {
		return res.status(400).json({msg: error.message})
	}

})

/* POST register user */
router.post('/register', async function(req, res) {
	const payload = _.pick(req.body, ['username', 'email', 'password', 'password_confirmation'])

	try {
		const {error, value} = Joi.validate(payload, JoiHelper.validateReg())
		if(error) throw new Error(error.message)

		const {username, email, password} = value

		let user = new User({username, email})
		user.setPassword(password)
		user.save((err, user) => {
			if(err){
				return res.status(400).json({msg: err.message})
			}

			res.status(200).json(user)
		})

	} catch (error) {
		return res.status(400).json({msg: error.message})
	}

})

module.exports = router
