// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");

print("drop collection: ", coll.drop());

print("===================  bulk  ====================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({
  name: "xiaoli",
  age: 20,
  address: { city: "Shanghai", province: "Shanghai" },
});
bulk.insert({
  name: "xiaoming",
  age: 23,
  address: { city: "Jinan", province: "Shandong" },
});
var result = bulk.execute();
printjson(result);

// print("=================  compound index  =====================");
// result = coll.createIndex({"name": 1, "age": -1, "address": 1});
// print("******  create index: ", tojson(result));
//
// result = coll.find({"age": 23}).explain().queryPlanner.winningPlan;
// print("******  query plan: ", tojson(result));
//
// result = coll.find({"name": "xiaoming", "age": 23}).explain().queryPlanner.winningPlan;
// print("******  query plan: ", tojson(result));

print(
  "======================  compound index  ================================"
);
result = coll.createIndex({ name: 1, age: -1, address: 1 });
print("******  create index: ", tojson(result));

print("*********************************");
result = coll.find().sort({ name: 1, age: 1 }).explain().queryPlanner
  .winningPlan;
printjson(result);
print("");

print("*********************************");
result = coll.find().sort({ name: 1, age: -1 }).explain().queryPlanner
  .winningPlan;
printjson(result);
print("");

print("*********************************");
result = coll.find().sort({ name: -1, age: 1 }).explain().queryPlanner
  .winningPlan;
printjson(result);
print("");
