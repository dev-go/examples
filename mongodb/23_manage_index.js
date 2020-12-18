// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");
print("drop collection: ", tojson(coll.drop()));

print("====================  bulk  ========================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({ name: "xiaoli", age: 20, score: [95, 98, 99] });
bulk.insert({ name: "xiaoqiang", age: 22, score: [95, 99] });
var result = bulk.execute();
printjson(result);
print("");

print("===================  manage index  ==========================");
result = coll.createIndex(
  { name: 1, age: -1 },
  { name: "name:up_age:down", unique: true, sparse: true, background: true }
);
print("*** ***  create index: ", tojson(result));
print("");

// print("*** ***  get indexes: ", tojson(coll.getIndexes()));
// print("");
//
// print("*** ***  drop index: ", tojson(coll.dropIndex("name:up_age:down")));
// print("");
//
// print("*** ***  get indexes: ", tojson(coll.getIndexes()));
// print("");

print("=============  explain  queryPlanner  =====================");
// result = coll.find().explain();
// printjson(result)
// result = coll.find().explain(false);
// printjson(result);
result = coll.find().explain("queryPlanner");
printjson(result);

print("============== explain executionStats  ==========================");
result = coll.find().explain("executionStats");
printjson(result);

print(
  "==============  explain  allPlansExecution  ============================="
);
// result = coll.find().explain(true);
// printjson(result);
result = coll.find().explain("allPlansExecution");
printjson(result);
