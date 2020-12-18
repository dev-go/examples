// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");
print("drop collection: ", coll.drop());

print("=================  bulk  =======================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({
  _id: 1,
  name: "xiaoli",
  age: 20,
  score: [
    { subject: "Chinese", score: 90 },
    { subject: "Math", score: 95 },
  ],
});
bulk.insert({
  _id: 2,
  name: "xiaoqiang",
  age: 22,
  score: [
    { subject: "Chinese", score: 92 },
    { subject: "English", score: 90 },
  ],
});
var result = bulk.execute();
printjson(result);

print("=================  multikey  ==========================");
print("******  not use index");
result = coll.find({ "score.subject": "English" }).explain().queryPlanner
  .winningPlan;
printjson(result);
print("");

print("******  create index");
result = coll.createIndex({ "score.subject": 1 });
printjson(result);
print("");

print("******  use index");
result = coll.find({ "score.subject": "English" }).explain().queryPlanner
  .winningPlan;
printjson(result);
print("");
