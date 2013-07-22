var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , config = require("./config")
  , http = require('http')
  , path = require('path')
  , EmployeeProvider = require('./employeeprovider').EmployeeProvider;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var employeeProvider = new EmployeeProvider(
  config.db.path, 
  config.db.port, 
  config.db.dbname,
  config.db.username,
  config.db.password
);

//Routes

app.get('/', function(req, res){
  employeeProvider.findAll(function(error, emps){
      res.render('index', {
            title: 'Employees',
            employees:emps,
            error: error
        });
  });
});

app.get('/employee/new', function (req, res) {
    res.render('employee_new', {
        title: 'New Employee'
    });
});

//save new employee
app.post('/employee/new', function (req, res){
    employeeProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});


app.get('/employee/:id/edit', function (req, res) {
    employeeProvider.findById(req.param('_id'), function(error, employee) {
        res.render('employee_edit', { 
            employee: employee
        });
    });
});


app.post('/employee/:id/edit', function (req, res) {
    employeeProvider.update(req.param('_id'), {
        title: req.param('title'),
        name: req.param('name')
    }, function(error, docs) {
        res.redirect('/')
    });
});


app.post('/employee/:id/delete', function(req, res) {
    employeeProvider.delete(req.param('_id'), function (error, docs) {
        res.redirect('/')
    });
});















app.listen(3000);
console.log("App is listening to ", 3000);