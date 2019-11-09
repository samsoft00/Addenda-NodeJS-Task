var express 	= require('express')
var router 		= express.Router()
const _ 			= require('lodash')
const Joi 		= require('@hapi/joi')
const JoiHelper	= require('../helper/joi.helper')
const User 		= require('../models/user.model')

/* POST user login. */
router.post('/login', function(req, res) {

	try {
		const payload = _.pick(req.body, ['email', 'password'])

		const {error, value} = Joi.validate(payload,  JoiHelper.validateLogin())
		if(error) throw new Error(error.message)



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

		let user = new User(value)
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