var express 	= require('express')
var router 		= express.Router()
const auth    = require('../helper/middleware.helper')
const {
	createContact,
	updateContact,
	getAllContacts
} = require('../controllers/contact.controller')

/* POST new contact. */
router.post('/', auth, createContact)

/* Update existing contact */
router.put('/:id', auth, updateContact)

/* Get all contact */
router.get('/', getAllContacts)

module.exports = router
