const jwt 			= require('jsonwebtoken')
const dbConfig 	= require('../config/database')


module.exports = (req, res, next) => {

	if(req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'){

		let token = req.headers.authorization.split(' ')[1]
		jwt.verify(token, dbConfig.secret, function(err, decoded){
			if(err) return res.status(401).json(err)
			req.user = decoded
			next()
		})
		return
	}

	return res.status(401).json({msg: 'Unauthorized access'})
}
