// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");
print("drop collection: ", coll.drop());

print("==============  bulk  ============");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({ _id: 5, name: "xiaoli", age: 20, score: [95, 98, 99] });
bulk.insert({ _id: 6, name: "xiaoqiang", age: 22, score: [95, 99] });
bulk.insert({ _id: 7, name: "xiaoming", age: 22, score: [99, 95, 98] });
var result = bulk.execute();
printjson(result);

print("==============  find  ============");
var cursor = coll.find();
printjson(cursor.toArray());

// print("==============  find whole array  ============");
// cursor = coll.find({"score": [99, 95, 98]});
// printjson(cursor.toArray());
//
// print("==============  find one element of array  ============");
// cursor = coll.find({"score": 98});
// printjson(cursor.toArray());
//
// print("==============  find one element on special index of array  ============");
// cursor = coll.find({"score.0": 95});
// printjson(cursor.toArray());

// print("==============  find $all  ====================");
// cursor = coll.find({"score": {"$all": [95, 98]}});
// printjson(cursor.toArray());

// print("==============  find $elemMatch  ====================");
// cursor = coll.find({"score": {"$elemMatch": {"$gt": 95, "$lt": 99}}});
// printjson(cursor.toArray());
//
// print("==============  find not use $elemMatch  ====================");
// cursor = coll.find({"score": {"$gt": 95, "$lt": 99}});
// printjson(cursor.toArray());

// print("===============  find $size  ====================");
// cursor = coll.find({"score": {"$size": 2}});
// printjson(cursor.toArray());

// print("=================  find field $elemMatch  ====================");
// cursor = coll.find({}, {"score": {"$elemMatch": {"$gt": 95, "$lt": 99}}});
// printjson(cursor.toArray());

// print("=====================  find field $slice  =======================");
// cursor = coll.find({}, {"score": {"$slice": 2}});
// printjson(cursor.toArray());
//
// print("=====================  find field $slice  =======================");
// cursor = coll.find({}, {"score": {"$slice": [1, 5]}});
// printjson(cursor.toArray());

print("=======================  find field $  ==========================");
cursor = coll.find({ score: { $gt: 94 } }, { "score.$": 1 });
printjson(cursor.toArray());
