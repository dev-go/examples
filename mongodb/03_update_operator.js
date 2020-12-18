// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");

print("drop collection: ", coll.drop());

print("========  bulk  ================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({
  _id: NumberInt(1),
  name: "xiaoli",
  age: NumberInt(18),
  address: {
    province: "Shandong",
    city: "Jinan",
  },
});
bulk.insert({
  _id: NumberInt(2),
  name: "xiaoli",
  age: NumberInt(19),
  address: {
    province: "Shandong",
    city: "Ti'an",
  },
});
bulk.insert({
  _id: NumberInt(3),
  name: "xiaoli",
  age: NumberInt(20),
  address: {
    province: "Shandong",
    city: "Xintai",
  },
});
var result = bulk.execute();
printjson(result);

print("=========== find =======================");
var cursor = coll.find();
printjson(cursor.toArray());

// print("============ update ===============");
// // multi update only works with $ operators
// result = coll.update({"name": "xiaoli"}, {"name": "xiaoli_2", "age": NumberInt(100)});
// printjson(result);
//
// print("=========== find =======================");
// cursor = coll.find();
// printjson(cursor.toArray());

// print("============ update $set ===============");
// result = coll.update({"name": "xiaoli"}, {"$set": {"name": "xiaoli_2", "age": NumberInt(100)}});
// printjson(result);
//
// print("=========== find =======================");
// cursor = coll.find();
// printjson(cursor.toArray());

// print("============ update $set + {multi: true} ===============");
// result = coll.update({"name": "xiaoli"}, {"$set": {"name": "xiaoli_2", "age": NumberInt(100)}}, {"multi": true});
// printjson(result);
//
// print("=========== find =======================");
// cursor = coll.find();
// printjson(cursor.toArray());

// print("============ update $inc + {multi: true} ==============");
// result = coll.update({"name": "xiaoli"}, {"$inc": {"age": NumberInt(100)}}, {multi: true});
// printjson(result);
//
// print("=========== find =======================");
// cursor = coll.find();
// printjson(cursor.toArray());

// print("============ update $min + {multi: true} ==============");
// result = coll.update({"name": "xiaoli"}, {"$min": {"age": NumberInt(19)}}, {multi: true});
// printjson(result);
//
// print("=========== find =======================");
// cursor = coll.find();
// printjson(cursor.toArray());

print("============ update $currentDate + {multi: true} ==============");
result = coll.update(
  { name: "xiaoli" },
  {
    $currentDate: {
      modify_time_01: true,
      modify_time_02: { $type: "timestamp" },
      modify_time_03: false,
    },
  },
  { multi: true }
);
printjson(result);

print("=========== find =======================");
cursor = coll.find();
printjson(cursor.toArray());
