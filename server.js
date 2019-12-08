/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
//var logger = require('morgan')
//var methodOverride = require('method-override')
//var session = require('express-session')
//var bodyParser = require('body-parser')

var app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'))
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')))
//app.use(logger('dev'))
//app.use(methodOverride());
//app.use(require('stylus').middleware({ src: __dirname + '/public' }));
/*app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }))*/
//app.use(bodyParser.urlencoded({ extended: true }))


//Define Application Routes
//var resourceProvider = new ResourceProvider();

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
//app.use('/', indexRouter);
//app.use('/users', userRouter);

// Route for Login View
app.get('/', function(req, res){
    res.render('vis3d.pug', {
        title: "3D Visualization Tutorial"
    })
});


app.set('domain', '0.0.0.0')
app.listen(3011, () => console.log("Express Server Running..."))
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
