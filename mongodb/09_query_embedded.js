// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");
print("drop collection: ", coll.drop());

print("===================  bulk  ==========================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({
  name: "xiaoli",
  age: 20,
  address: { province: "Shandong", city: "Ti'an" },
});
bulk.insert({
  name: "xiaoli",
  age: 20,
  address: { city: "Ti'an", province: "Shandong" },
});
bulk.insert({
  name: "xiaoli",
  age: 20,
  address: { province: "Shandong", city: "Jinan" },
});
var result = bulk.execute();
print(result);

print("===================  find  ==========================");
var cursor = coll.find({});
printjson(cursor.toArray());

print("===================  find  ==========================");
cursor = coll.find({ address: { province: "Shandong" } });
printjson(cursor.toArray());

print("===================  find  ==========================");
cursor = coll.find({ address: { city: "Ti'an", province: "Shandong" } });
printjson(cursor.toArray());

print("===================  find  ==========================");
cursor = coll.find({ "address.province": "Shandong", "address.city": "Ti'an" });
printjson(cursor.toArray());
