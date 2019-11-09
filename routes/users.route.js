var express 		= require('express')
var router 			= express.Router()
const _ 				= require('lodash')
const Joi 			= require('@hapi/joi')
const JoiHelper	= require('../helper/joi.helper')
const User 			= require('../models/user.model')

/* POST user login. */
router.post('/login', async function(req, res) {

	try {
		const payload = _.pick(req.body, ['email', 'password'])

		const {error, value} = Joi.validate(payload,  JoiHelper.validateLogin())
		if(error) throw new Error(error.message)

		const user = await User.findOne({email: value.email})
		if(user === null) throw new Error('Invalid credentials')

		if(!user.validatePassword(value.password)){
			throw new Error('Invalid credentials')
		}

		const data = user.toAuthJSON()
		return res.status(200).json(data)

	} catch (error) {
		return res.status(400).json({msg: error.message})
	}

})

/* POST register user */
router.post('/register', async function(req, res) {
	const data = _.pick(req.body, ['username', 'email', 'password', 'password_confirmation'])

	try {
		const {error, value} = Joi.validate(data, JoiHelper.validateReg())
		if(error) throw new Error(error.message)

		let user = new User({...value})
		let saveUser = await user.save()

		res.status(200).json(_.pick(saveUser, ['_id', 'username', 'email', 'createdAt', 'updatedAt']))
	} catch (error) {
		return res.status(500).json({msg: error.message})
	}

})

module.exports = router
