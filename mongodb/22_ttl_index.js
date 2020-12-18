// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");
print("drop collection: ", tojson(coll.drop()));

print("==================  bulk  =========================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({ _id: 5, name: "xiaoli", modify_time: new Date() });
bulk.insert({ _id: 6, name: "xiaoming" });
var result = bulk.execute();
printjson(result);
print("");

print("==================  TTL index  ======================");
var result = coll.createIndex({ modify_time: 1 }, { expireAfterSeconds: 5 });
print("*** ***  create index: ", tojson(result));
print("");

function sleep(seconds) {
  for (var start = Date.now(); Date.now() - start <= 1000 * seconds; ) {}
}

// print("sleep ...");
// sleep(10);
// print("resume ...");
// print("");
//
// print("==================  find  ===========================");
// printjson(coll.find().toArray());
// print("");
//
// print("sleep ...");
// sleep(60);
// print("resume ...");
// print("");
//
// print("==================  find  ===========================");
// printjson(coll.find().toArray());
// print("");

db.runCommand({
  collMod: "student",
  index: {
    keyPattern: { modify_time: 1 },
    expireAfterSeconds: 120,
  },
});

print("sleep ...");
sleep(60);
print("resume ...");
printjson(coll.find().toArray());
