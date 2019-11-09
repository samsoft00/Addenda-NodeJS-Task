var express 		= require('express')
var router 			= express.Router()
const _ 				= require('lodash')
const Joi 			= require('@hapi/joi')
const JoiHelper	= require('../helper/joi.helper')
const User 			= require('../models/user.model')

/* POST user login. */
router.post('/login', function(req, res) {

	try {
		const payload = _.pick(req.body, ['email', 'password'])

		const {error, value} = Joi.validate(payload,  JoiHelper.validateLogin())
		if(error) throw new Error(error.message)

		User.findOne({email: value.email}, function(err, user) {
			if(err) return res.status(400).json({msg: err.message})
			if(user === null) return res.status(400).json({msg: 'Invalid credentials'})

			if(!user.validatePassword(value.password)){
				return res.status(400).json({msg: 'Invalid credentials'})
			}

			const data = user.toAuthJSON()
			return res.status(200).json(data)
		})

	} catch (error) {
		return res.status(400).json({msg: error.message})
	}

})

/* POST register user */
router.post('/register', async function(req, res) {
	const data = _.pick(req.body, ['username', 'email', 'password', 'password_confirmation'])

	try {
		const {error, payload} = Joi.validate(data, JoiHelper.validateReg())
		if(error) throw new Error(error.message)

		let user = new User(data)
		user.save((err, user) => {
			if(err){
				return res.status(400).json({msg: err.message})
			}

			res.status(200).json(_.pick(user, ['_id', 'username', 'email', 'createdAt', 'updatedAt']))
		})

	} catch (error) {
		return res.status(400).json({msg: error.message})
	}

})

module.exports = router
