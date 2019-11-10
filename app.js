require('dotenv').config()
var createError   = require('http-errors')
var express       = require('express')
var path          = require('path')
var cookieParser  = require('cookie-parser')
var logger        = require('morgan')
const mongoose    = require('mongoose')
const config      = require('./config/database')
const bodyParser 	= require('body-parser')
const cors    		= require('cors')

var indexRouter   = require('./routes/index')
var usersRouter   = require('./routes/users.route')
var contactsRouter= require('./routes/contacts.route')

mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

mongoose.Promise = global.Promise
mongoose.connect(config.database)

const db = mongoose.connection

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))

app.use(cors())

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/user', usersRouter)
app.use('/contact', contactsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = {app, db}
