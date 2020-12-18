// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");
print("drop collection: ", tojson(coll.drop()));

// print("=========================  bulk  ===============================");
// var bulk = coll.initializeUnorderedBulkOp();
// bulk.insert({"name": "xiaoli", "age": 20});
// bulk.insert({"name": "xaioming"});
// bulk.insert({"name": "xiaoqiang", "age": null});
// var result = bulk.execute();
// printjson(result);
// print("");
//
// print("=========================  unique index  =======================");
// print("****** create index");
// result = coll.createIndex({"age": 1}, {"unique": true});
// printjson(result);
//
// print("******  find");
// var cursor = coll.find({"age": null});
// printjson(cursor.toArray());

print("==========================  unique index  =========================");
print("****** create index");
var result = coll.createIndex({ "comment.author_id": 1 }, { unique: true });
printjson(result);
print("");

result = coll.insert({
  title: "01_hello_mongo",
  comment: [
    { author_id: "u001", text: "very good" },
    { author_id: "u001", text: "very nice" },
    { author_id: "u001", text: "very cool" },
  ],
});
printjson(result);
print("");

// result = coll.insert({"title": "02_forward_mongo", "comment": [{"author_id": "u002", "text": "good"}, {"author_id": "u003", "text": "nice"}, {"author_id": "u001", "text": "cool"}]});
result = coll.insert({
  title: "02_forward_mongo",
  comment: [
    { author_id: "u002", text: "good" },
    { author_id: "u003", text: "nice" },
  ],
});
printjson(result);
print("");
