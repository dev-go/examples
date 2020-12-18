// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");

print("drop collection: ", coll.drop());

print("================ bulk ==================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({ _id: 1, name: "liu", age: NumberInt(16) });
bulk.insert({ _id: 2, name: "fan", age: NumberInt(26) });
bulk.insert({ _id: 3, name: "he", age: NumberInt(15) });
var result = bulk.execute();
printjson(result);

print("=============== find ==================");
var cursor = coll.find();
printjson(cursor.toArray());
