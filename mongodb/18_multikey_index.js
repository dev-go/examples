// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");
print("drop collection: ", coll.drop());

print("=====================  bulk  ===================================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({ _id: 5, name: "xiaoli", age: 20, score: [95, 98, 99] });
bulk.insert({
  _id: 7,
  name: "xiaoming",
  age: 22,
  score: [99, 95, 98],
  tag: ["good", "nice"],
});
var result = bulk.execute();
printjson(result);

print("====================  multikey index  ==========================");
print("******  not use index");
result = coll.find({ score: 95 }).explain().queryPlanner.winningPlan;
printjson(result);
print("");

print("****** create index");
result = coll.createIndex({ score: 1 });
// result = coll.createIndex({"score": 1, "tag": 1}); // cannot index parallel arrays
printjson(result);
print("");

print("****** use index");
result = coll.find({ score: 99 }).explain().queryPlanner.winningPlan;
printjson(result);
print("");
