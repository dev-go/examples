// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");

print("drop collection: ", coll.drop());

print("===========  bulk  ================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({
  _id: NumberInt(1),
  name: "xiaoliu",
  age: NumberInt(18),
  address: {
    province: "Shangdong",
    city: "Jinan",
  },
});
var result = bulk.execute();
printjson(result);

print("===========  find  ================");
var cursor = coll.find();
printjson(cursor.toArray());

// print("===========  update whole embeded document ==============");
// result = coll.update({"_id": NumberInt(1)}, {"$set": {"address": {"province": "Shanghai", "city": "Shanghai"}}});
// printjson(result);
//
// print("===========  find  ================");
// cursor = coll.find();
// printjson(cursor.toArray());

print("===========  update some fields of embeded document ==============");
result = coll.update(
  { _id: NumberInt(1) },
  { $set: { "address.city": "Ti'an" } }
);
printjson(result);

print("===========  find  ================");
cursor = coll.find();
printjson(cursor.toArray());
