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
	},

	validateContact(){
		return Joi.object().keys({
			first_name : Joi.string().min(3).max(30).required().error(new Error('First name must be at least 3 characters long')),
			last_name : Joi.string().min(3).max(30).required().error(new Error('Last name must be at least 3 characters long')),
			phone_number : Joi.string().required().error(new Error('Phone number is compulsory')),
			street: Joi.string().required().error(new Error('Street name is required')),
			city: Joi.string().required().error(new Error('Input city of residence')),
			state : Joi.string().required().error(new Error('State is required')),
			country : Joi.string().required().error(new Error('Country is compulsory')),
			postal_code : Joi.string().required().error(new Error('Postal code e.g 23401'))
		}).with('first_name', ['last_name', 'phone_number', 'street', 'city', 'state', 'country', 'postal_code'])
	}

}
