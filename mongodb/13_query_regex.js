// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");
print("drop collection: ", coll.drop());

print("================  bulk  =========================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({ type: "Abc123", desc: "Single line desc" });
bulk.insert({ type: "abc789", desc: "First line\nSecond line" });
bulk.insert({ type: "xyz456", desc: "Many spaces before          line" });
bulk.insert({ type: "xyz789", desc: "Multiple\nline desc" });
var result = bulk.execute();
printjson(result);

print("================  find  =========================");
var cursor = coll.find();
printjson(cursor.toArray());

// print("================  find  ===========================");
// cursor = coll.find({"type": /^ABC/i});
// printjson(cursor.toArray());

// print("================  find  ===========================");
// // cursor = coll.find({"desc": /^S/m});
// cursor = coll.find({"desc": {"$regex": /^S/, "$options": "m"}});
// printjson(cursor.toArray());
//
// print("================  find  ===========================");
// cursor = coll.find({"desc": /^S/});
// printjson(cursor.toArray());

// print("=====================  find  =============================");
// cursor = coll.find({"desc": {"$regex": /m.*line/, "$options": "si"}});
// printjson(cursor.toArray());

print(
  "=======================  find  ========================================"
);
var pattern = "abc #category code\n123 #item number";
cursor = coll.find({ type: { $regex: pattern, $options: "xi" } });
printjson(cursor.toArray());
