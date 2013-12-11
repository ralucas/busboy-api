var MongoClient = require('mongodb').MongoClient
	, format = require('util').format;

var ObjectID = require('mongodb').ObjectID;

var localMongo = 'mongodb://127.0.0.1:27017/rtd';
var MongoUrl = process.env.MONGOHQ_URL ? process.env.MONGOHQ_URL : localMongo;

//values function
var values = function(arr, key){
    fieldArray = [];
    for(var i = 0; i < arr.length; i++){
        fieldArray.push(arr[i][key]);
    }
    return fieldArray;
};

var prefixRemove = function(arr){
    var nameArr = [];
    var result = [];
    for(var i = 0; i < arr.length; i++){
        var name = arr[i].split(".");
        result.push(name[1]);
    }
    return result;
};

exports.findAll = function (req, res){
	var collectionName = req.params.collection;
	MongoClient.connect(MongoUrl, function(err, db) {
		if(err) throw err;
		db.collection(collectionName).find({})
		.limit(10)
		.toArray(function(err, docs) {
			res.send(docs);
		});
	});
};

exports.findById = function (req, res, next){
	var collectionName = req.params.collection;
	var id = req.params.id;
	if(collectionName !== 'javascripts' || collectionName !== 'stylesheets')next();
		MongoClient.connect(MongoUrl, function(err, db) {
			if(err) throw err;
			db.collection(collectionName)
			.findOne({'_id' : new ObjectID(id)},
				function(err, doc){
					res.send(doc);
				});
			});
	//	}
};

exports.findByParameter = function (req, res){
	var collectionName = req.params.collection;
	var parameter = req.params.parameter;
	var value = req.params.value;
	var pair = {};
	pair[parameter] = value;
	MongoClient.connect(MongoUrl, function(err, db) {
		if(err) throw err;
		db.collection(collectionName).find(pair)
		.limit(10)
		.toArray(function(err, docs) {
			res.send(docs);
		});
	});
};

exports.getCollectionData = function (req, res){
	MongoClient.connect(MongoUrl, function(err, db) {
		if(err) throw err;
		db.collectionNames(function(err, collections){
			console.log(collections);
			var names = values(collections, "name");
			console.log(names);
			var a = prefixRemove(names);
			for(var i = 0; i < a.length; i++){}
			db.collection(a[6])
			.findOne({}, function(err, docs){
				console.log('f',docs);
			});
			res.send(collections);
		});
	});
};