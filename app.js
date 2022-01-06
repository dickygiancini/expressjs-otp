require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var helmet = require('helmet');
var logger = require('morgan');
var port = process.env.PORT || 4500;

var bodyParser = require('body-parser')

var flash = require('express-flash');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var registerRouter = require('./routes/register');

// var sendOTP = require('./routes/sendOTP_to_email');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
  cookie: { maxAge: 60000 },
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}))

app.use(flash()); 

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// // CORS UNTUK REQUEST
// var cors = require('cors');
// var corsOption = {
//   origin: "*",
//   methods: 'GET,PUT,POST,DELETE',
//   credentials: true,
//   exposedHeaders: ['x-auth-token']
// };
// app.use(cors(corsOption));

// app.use(helmet())

app.use('/', indexRouter);
// app.use('/register', registerRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
