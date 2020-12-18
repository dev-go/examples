// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");

print("drop collection: ", coll.drop());

print("========================  bulk  =====================");
var bulk = coll.initializeOrderedBulkOp();
for (var i = 0; i < 100000; i++) {
  bulk.insert({ index: i, name: "user" + i });
}
var result = bulk.execute();
printjson(result);

print("===================  Single Index  =================");
print("******  not use index");
result = coll.find({ name: "user10000" }).explain("executionStats")
  .executionStats;
print("examined docs count:   ", result.totalDocsExamined);
print(
  "execution time:        ",
  result.executionStages.executionTimeMillisEstimate
);
print("");

print("******  not use index, but find only one");
result = coll.find({ name: "user10000" }).limit(1).explain("executionStats")
  .executionStats;
print("examined docs count:   ", result.totalDocsExamined);
print(
  "execution time:        ",
  result.executionStages.executionTimeMillisEstimate
);
print("");

print("******  create single index");
result = coll.createIndex({ name: 1 });
print("create index: ", tojson(result));

print("******  use index");
result = coll.find({ name: "user10000" }).explain("executionStats")
  .executionStats;
print("examined docs count:   ", result.totalDocsExamined);
print(
  "execution time:        ",
  result.executionStages.executionTimeMillisEstimate
);
