// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");
print("drop collection: ", tojson(coll.drop()));

print("===================  bulk  ==================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({ name: "xiaoli", age: 20 });
bulk.insert({ name: "xiaoming", age: 21 });
bulk.insert({ name: "xiaoqiang" });
var result = bulk.execute();
printjson(result);

// print("===================  sparse index  ===============");
// result = coll.createIndex({"age": 1}, {"unique": true, "sparse": true});
// print("create index: ", tojson(result));
// print("");
//
// result = coll.insert({"name": "Joe"});
// print("insert document: ", tojson(result));
// result = coll.insert({"name": "Joe"});
// print("insert document: ", tojson(result));
//
// print("find :", tojson(coll.find().toArray()));

print("==================  sparse index  ========================");
result = coll.createIndex({ age: 1 }, { sparse: true });
print("*** ***  create index: ", tojson(result));
print("");

print("*** ***  not use hint");
var cursor = coll.find().sort({ age: -1 });
var plan = cursor.explain().queryPlanner.winningPlan;
print("plan: ", tojson(plan));
print("docs: ", tojson(cursor.toArray()));
print("");

print("*** ***  use hint");
cursor = coll.find().sort({ age: -1 }).hint({ age: 1 });
plan = cursor.explain().queryPlanner.winningPlan;
print("plan: ", tojson(plan));
print("docs: ", tojson(cursor.toArray()));
print("");
