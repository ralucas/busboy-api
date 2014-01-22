// Module dependencies
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var api = require('./routes/api');
var http = require('http');
var path = require('path');
var _ = require('underscore');

var app = express();
var server = http.createServer(app);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//page routing
app.get('/', routes.index);
app.get('/users', user.list);

//ajax request processing
app.get('/listNames', api.getCollectionNames);

//routing for mongo rest api
app.get('/api/:collection', api.findAll);
app.get('/api/:collection/:id', api.findById);
app.get('/api/:collection/:parameter', api.findByParameter);
app.get('/api/:collection/:parameter/:value', api.findByValue);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
