var MongoClient = require('mongodb').MongoClient,
    format = require('util').format,
    _ = require('underscore'),
    ObjectID = require('mongodb').ObjectID,
    Q = require('q'),
    calculate = require('../helpers/calculate');

var localMongo = 'mongodb://127.0.0.1:27017/rtd';
var MongoUrl = process.env.MONGOHQ_URL ? process.env.MONGOHQ_URL : localMongo;

console.log(MongoUrl);

//values function
var values = function(arr, key) {
    fieldArray = [];
    for(var i = 0; i < arr.length; i++) {
        fieldArray.push(arr[i][key]);
    }
    return fieldArray;
};

//remove db prefix attached to each collection (i.e. 'rtd')
var prefixRemove = function(arr) {
    var result = [];
    for(var i = 0; i < arr.length; i++) {
        var name = arr[i].split(".");
        result.push(name[1]);
    }
    return result;
};

/*
* Api Functions
*
* TODO: Get away from exports move to better module pattern, perhaps prototype
*/

//sends entire collection
exports.findAll = function(req, res) {
    var collectionName = req.params.collection;
    MongoClient.connect(MongoUrl, function(err, db) {
        if(err) throw err;
        db.collection(collectionName).find({})
        .toArray(function(err, docs) {
            res.send(docs);
        });
    });
};

//finds single document by _id and sends it
exports.findById = function(req, res, next) {
    var collectionName = req.params.collection;
    var id = req.params.id;
    MongoClient.connect(MongoUrl, function(err, db) {
        if(err) throw err;
        db.collection(collectionName)
        .findOne({ '_id' : new ObjectID(id) },
            function(err, doc) {
                res.send(doc);
            }
        );
    });
};

//not sure this is needed
exports.findByParameter = function(req, res) {
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

//finds a document by it's collection/key/value
//and sends back those documents that have that
//value -- need to be able to offer a range here
exports.findByValue = function(req, res) {
    var collectionName = req.params.collection;
    var parameter = req.params.parameter;
    var value = req.params.value;
    var pair = {};
    pair[parameter] = value;
    MongoClient.connect(MongoUrl, function(err, db) {
        if(err) new Error(err);
        db.collection(collectionName).find(pair)
        .limit(10)
        .toArray(function(err, docs) {
            res.send(docs);
        });
    });
};

// exports.findByTime = function(req, res) {
//     var collectionName = req.params.collection,
//         beginTime = req.params.begin,
//         endTime = req.params.end;

//         MongoClient.connect(MongoUrl, function(err, db) {
//             if(err) console.error('ERROR in findByTime');
//             db.collection(collectionName)
//                 .find({beginTime < 'arrival_time': beginTime})
//         })
// }

exports.findByLocation = function(req, res) {
    var lat = req.params.lat,
        lon = req.params.lon,
        deferred = Q.defer(),
        output;

        MongoClient.connect(MongoUrl, function(err, db) {
            if (err) new Error(err);
            db.collection('stops').find({}, function(err, docs) {
                if (err) {
                    deferred.reject(new Error(err));
                } else {
                    output = calculate.calculateDistance(lat, lon, docs);
                    deferred.resolve(output);
                }
            });
        });
    res.send(deferred.promise);
};

//creates array of collection names and their associated keys
exports.getCollectionNames = function(req, res) {
    MongoClient.connect(MongoUrl, function(err, db) {
        if(err) throw err;
        db.collectionNames(function(err, collections) {
            console.log(collections);
            var colls = values(collections, 'name');
            var collNames = prefixRemove(colls);
            var keyArr = [];
            collNames.forEach(function(element, index, collNames) {
                db.collection(element).findOne({}, function(err, docs) {
                    if(docs){
                        var arr = [];
                        for(var key in docs) {
                            arr.push(key);
                        }
                        var keyObj = {};
                        keyObj[element] = arr;
                        keyArr.push(keyObj);
                    }
                    setTimeout(function(){
                        res.send(keyArr);
                    },100);
                });
            });
        });
    });
};

var getCollections = function(arr) {
    MongoClient.connect(MongoUrl, function(err, db) {
        if(err) throw err;
        db.collectionNames(function(err, collections) {
            arr = collections;
            console.log('c', arr);
            return arr;
        });
    });
};

exports.getEachCollectionKeys = function(req, res) {
    MongoClient.connect(MongoUrl, function(err, db) {
        if(err) throw err;
        db.collectionNames(function(err, collections) {
            var colls = values(collections, 'name');
            var collNames = prefixRemove(colls);
            var keyArr = [];
            collNames.forEach(function(element, index, collNames) {
                db.collection(element)
                .findOne({}, function(err, docs) {
                    if(docs){
                        keyArr.push(docs);
                    }
                    Q(keyArr).done(res.send(keyArr));
                    // setTimeout(function() {
                    //     res.send(keyArr);
                    // },100);
                });
            });
        });
    });
};
