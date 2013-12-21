var MongoClient = require('mongodb').MongoClient
	, format = require('util').format;
var _ = require('underscore');
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var async = require('async');

var localMongo = 'mongodb://127.0.0.1:27017/rtd';
var MongoUrl = process.env.MONGOHQ_URL ? process.env.MONGOHQ_URL : localMongo;

mongoose.connect(MongoUrl);

//values function
var values = function(arr, key){
    fieldArray = [];
    for(var i = 0; i < arr.length; i++){
        fieldArray.push(arr[i][key]);
    }
    return fieldArray;
};

var prefixRemove = function(arr){
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
	MongoClient.connect(MongoUrl, function(err, db) {
		if(err) throw err;
		db.collection(collectionName).find({parameter : {}})
		.limit(10)
		.toArray(function(err, docs) {
			res.send(docs);
		});
	});
};

exports.findByValue = function (req, res){
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


exports.getCollectionNames = function (req, res){
	MongoClient.connect(MongoUrl, function(err, db) {
		if(err) throw err;
		db.collectionNames(function(err, collections){
			res.send(collections);
		});
	});
};

var newArr = [];

var getCollections = function(arr){
	MongoClient.connect(MongoUrl, function(err, db){
		if(err) throw err;
		db.collectionNames(function(err, collections){
			arr = collections;
			console.log('c', arr);
			return arr;
		});
	});
};

//setTimeout(getCollections(), 5000);

// var getCollectionKeys = function(){
// 			var colls = getCollections(newArr);
// 			console.log('colls',colls);
// 			var names = values(colls, "name");
// 			var collNames = prefixRemove(names);
// 			console.log('cn', collNames);
// 			var keyArr = [];
// 			collNames.forEach(function(element, index, collNames){
// 				db.collection(element)
// 				.findOne({}, function(err, docs){
// 					keyArr.push(docs);
// 				});
// 				console.log(keyArr);
// 			});
// 			console.log('ka', keyArr);
// 			return keyArr;
// 		};

exports.getEachCollectionKeys = function (req, res){
	MongoClient.connect(MongoUrl, function(err, db){
		if(err) throw err;
		db.collectionNames(function(err, collections){
			var colls = values(collections, 'name');
			var collNames = prefixRemove(colls);
			var keyArr = [];
			collNames.forEach(function(element, index, collNames){
				db.collection(element)
				.findOne({}, function(err, docs){
					if(docs){
						keyArr.push(docs);
					}
					setTimeout(function(){
						res.send(keyArr);
					},100);
				});
			});
		});
	});
};

