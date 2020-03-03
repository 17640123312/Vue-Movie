var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var MongoStore  = require("connect-mongo")(session);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var movieRouter = require('./routes/movie');
var upload = require('./routes/upload');
var app = express();
var cors = require('cors');
app.use(cors({
      origin:['http://localhost:8080'],
      methods:["POST","GET"],
      alloweHeaders:['Content-Type','Authorization']
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var NedbStore = require('nedb-session-store')( session );
const sessionMiddleware = session({
  secret: "fas fas",
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge:    60*60 * 1000   // e.g. 1 year
  },
  store: new NedbStore({
    filename: 'path_to_nedb_persistence_file.db'
  })
});
app.use(sessionMiddleware);
app.use(function (req, res, next) {
  req.header("Access-Control-Allow-Credentials", "true");
  req.header('Access-Control-Allow-Origin', 'http://localhost:8080/');
  req.header("Access-Control-Allow-Headers", "X-Requested-With");
  req.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  req.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  req.header("X-Powered-By",' 3.2.1');
  req.header("Content-Type", "application/json;charset=utf-8");
  if (req.method == 'OPTIONS') {
    res.send(200); /*让options请求快速返回*/
  } else {
    next();
  }
});

app.use('/upload', upload);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/admin/movie', movieRouter);

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
  res.render('error');
});

module.exports = app;
