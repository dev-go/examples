// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");
print("drop collection: ", coll.drop());

print("=============  bulk  ================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({ name: "Joe", age: NumberInt(20) });
bulk.insert({ name: "Joe", age: NumberInt(18) });
bulk.insert({ name: "Jack", age: NumberInt(19) });
bulk.insert({ name: "John", age: NumberInt(20) });
bulk.insert({ name: "John", age: null });
bulk.insert({ name: "John", "": NumberInt(20) });
bulk.insert({ name: "John" });
var result = bulk.execute();
printjson(result);

print("=============  find  ================");
var cursor = coll.find();
printjson(cursor.toArray());

// print("=============  find  ===============");
// cursor = coll.find({}, {"_id": 0, "name": 1, "age": 1}).limit(5).skip(1).sort({"age": -1});
// printjson(cursor.toArray());

// print("=============  find  ===============");
// // cursor = coll.find({"age": NumberInt(20)});
// cursor = coll.find({"age": {"$eq": NumberInt(20)}});
// printjson(cursor.toArray());

// print("=============  find  ===============");
// cursor = coll.find({"age": {"$in": [NumberInt(20), NumberInt(19)]}});
// printjson(cursor.toArray());

// print("=============  find  ===============");
// cursor = coll.find({"age": {"$nin": [NumberInt(20), NumberInt(19)]}});
// printjson(cursor.toArray());

// print("=============  find  ===============");
// cursor = coll.find({
//     "$and": [
//         {"$or": [{"age": NumberInt(20)}, {"age": NumberInt(18)}]},
// 	{"$or": [{"name": "Joe"}, {"name": "John"}]}
//     ]
// });
// printjson(cursor.toArray());

// print("=============  find  ===============");
// cursor = coll.find({
//     "$nor": [
//         {"age": NumberInt(20)},
// 	{"name": "Joe"}
//     ]
// });
// printjson(cursor.toArray());

// print("=============  find  ===============");
// cursor = coll.find({"age": {"$not": {"$gte": NumberInt(20), "$lte": NumberInt(30)}}});
// printjson(cursor.toArray());

print("=============  find  ===============");
cursor = coll.find({ age: { $exists: true } });
printjson(cursor.toArray());
