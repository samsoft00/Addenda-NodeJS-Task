const _ 			  = require('lodash')
const Joi 		  = require('@hapi/joi')
const JoiHelper	= require('../helper/joi.helper')
const Contact 	= require('../models/contact.model')

module.exports = {
  async createContact(req, res){
    const {id} = req.user

    try{
      const data = _.pick(req.body, [
        'first_name',
        'last_name',
        'phone_number',
        'street',
        'city',
        'state',
        'country',
        'postal_code'
      ])

      const {error, value} = Joi.validate(data,  JoiHelper.validateContact())
      if(error) throw new Error(error.message)

      let contact = new Contact(value)
      contact.user = id
      let savedContact = await contact.save()

      res.status(200).json(savedContact)

    }catch(error){
      return res.status(400).json({msg: error.message})
    }
  },

  async updateContact(req, res){

    try {
      const {id} = req.params
      const data = _.pick(req.body, [
        'first_name',
        'last_name',
        'phone_number',
        'street',
        'city',
        'state',
        'country',
        'postal_code'
      ])

      const {error, value} = Joi.validate(data,  JoiHelper.validateContact())
      if(error) throw new Error(error.message)

      let contact = await Contact.findOneAndUpdate({_id: id}, {$set: value}, {new: true})
      if(!contact) throw new Error(`Contact with ID: ${id} not found!`)

      return res.status(200).json(contact)

    } catch (error) {
      return res.status(400).json({msg: error.message})
    }
  },

  async getAllContacts(req, res){
    const {page, pageSize} = req.query

    let ipage       = parseInt( page || 1 )
    let limit       = parseInt( pageSize || 25 )
    let offset      = parseInt((ipage - 1), 10) * limit

    let contacts = await Contact.paginate({}, { offset, limit })
    res.status(200).json(contacts)
  }

}
