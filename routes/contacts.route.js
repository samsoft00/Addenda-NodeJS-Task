var express 	= require('express')
var router 		= express.Router()
const _ 			= require('lodash')
const Joi 		= require('@hapi/joi')
const JoiHelper	= require('../helper/joi.helper')
const Contact 		= require('../models/contact.model')

/* POST new contact login. */
router.post('/', function(req, res) {})

/* Update existing contact */
router.put('/:id', function(req, res) {})

/* Get all contact */
router.get('/', function(req, res) {})
