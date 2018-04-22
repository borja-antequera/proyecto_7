var createError = require('http-errors');
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
//Carga de libreria session-flash
var flash = require('connect-flash');
var winston = require('./config/winston');
var paginate= require('express-paginate');
var indexRouter = require('./routes/routes');
var admins=require('./routes/admins');
var users = require('./routes/users');

var hbs = require('hbs');
var hbsUtils = require('hbs-utils')(hbs);

var mailer=require('./routes/mailer');

var app = express();

app.use(paginate.middleware(2,20));
//partials
hbs.registerPartials(`${__dirname}/views/partials/`);

//hbsUtils
hbsUtils.registerWatchedPartials(`${__dirname}/views/partials/`);

require('./helpers/hbs')(hbs);

//app.use(logger('dev'));
app.use(morgan('combined', {stream: winston.stream}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/components', express.static(`${__dirname}/public/components/`));



app.use(session({
    secret: 'clavesecreta',
    name: 'cookiedemiapp',
    resave: true,
    saveUninitialized:true
}));

app.use(flash());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use('/mailer',mailer);

app.use('/admins',admins); //de la transparencia
app.use('/users', users);
app.use('/', indexRouter);
// catch 404 and forward to error handler

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error404',{
      layout: 'templates/errorTemplate'
  });
});

module.exports = app;
