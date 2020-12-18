// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");
print("drop collection: ", coll.drop());

print("====================  bulk  ==================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({ _id: 1, name: "xiaoli", age: 20, score: 90 });
bulk.insert({ _id: 2, name: "xiaoli", age: 22, score: 95 });
var result = bulk.execute();
printjson(result);

print("===================  find  ================");
var cursor = coll.find();
printjson(cursor.toArray());

// print("=============  findAndModify  =======================");
// var obj = coll.findAndModify({
//     "query": {"name": "xiaoli"},
//     "sort": {"age": 1},
//     "update": {"$inc": {"score": 60}},
//     "new": true,
//     "upsert": true
// });
// printjson(obj);
//
// print("===================  find  ================");
// var cursor = coll.find();
// printjson(cursor.toArray());

print("===============  findAndModify  =====================");
var obj = coll.findAndModify({
  query: { name: "xiaoli" },
  sort: { age: 1 },
  remove: true,
});
printjson(obj);

print("===============  find  =============================");
cursor = coll.find();
printjson(cursor.toArray());
