var MongoClient = require('mongodb').MongoClient
	, format = require('util').format;
var ObjectID = require('mongodb').ObjectID;

exports.findAll = function (req, res){
	var collectionName = req.params.collection;
	MongoClient.connect('mongodb://127.0.0.1:27017/rtd', function(err, db) {
		if(err) throw err;
		db.collection(collectionName).find({})
		.limit(10)
		.toArray(function(err, docs) {
			res.send(docs);
		});
	});
};

exports.findById = function (req, res){
	var collectionName = req.params.collection;
	var id = req.params.id;
	MongoClient.connect('mongodb://127.0.0.1:27017/rtd', function(err, db) {
		if(err) throw err;
		db.collection(collectionName).findOne({'_id' : new ObjectID(id)},
			function(err, doc){
				res.send(doc);
			});
	});
};

exports.findByParameter = function (req, res){
	var collectionName = req.params.collection;
	var parameter = req.params.parameter;
	var value = req.params.value;
	console.log('p', parameter);
	console.log(value);
	MongoClient.connect('mongodb://127.0.0.1:27017/rtd', function(err, db) {
		if(err) throw err;
		db.collection(collectionName).find({"parameter" : value})
		.limit(10)
		.toArray(function(err, docs) {
			res.send({parameter:value});
		});
	});
};
