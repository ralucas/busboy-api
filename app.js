
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
var mongoose = require('mongoose');

var app = express();
var server = http.createServer(app);

mongoose.connect("mongodb://localhost/rtd");

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


app.get('/', routes.index);
app.get('/users', user.list);

//routing for mongo rest api
app.get('/:id', function (req, res){
	var collectionName = req.params.id;
	MongoClient.connect('mongodb://127.0.0.1:27017/rtd', function(err, db) {
		if(err) throw err;
		db.collection(collectionName).find({}).limit(10).toArray(function(err, docs) {
			res.send(docs);
		});
	});
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
