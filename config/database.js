//const env = process.env.NODE_ENV || 'dev'
const addendaDb = 'mongodb://localhost:27017/addenda'

module.exports = {
	database: addendaDb,
	secret: process.env.LOCAL_DB_SECRET
}
