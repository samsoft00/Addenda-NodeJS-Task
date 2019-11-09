const Joi 		= require('@hapi/joi')

module.exports = {

	validateReg(){
		return Joi.object({
			username: Joi.string().min(3).max(30).required().error(new Error('Username must be at least 3 characters long')),
			email: Joi.string().email({ minDomainSegments: 2 }).required().error(new Error('Enter valid email address!')),
			password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required().error(new Error('Password required')),
			password_confirmation: Joi.any().valid(Joi.ref('password')).required().error(new Error('Password and confirm password must match'))
		})
	},

	validateLogin(){
		return Joi.object().keys({
			email: Joi.string().email({ minDomainSegments: 2 }).error(new Error('Email address is required!')),
			password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required().error(new Error('Password required'))
		}).with('email', 'password')
	}

}
