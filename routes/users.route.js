var express 		= require('express')
var router 			= express.Router()
const {
	login,
	register
} 				= require('../controllers/user.controller')

/* POST user login. */
router.post('/login', login)

/* POST register user */
router.post('/register', register)

module.exports = router
