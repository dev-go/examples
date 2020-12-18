// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("article");
print("drop collection: ", tojson(coll.drop()));

print("=====================  bulk  ========================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({ title: "Hello Boys!", keyword: "Welcome to use MongoDB!" });
bulk.insert({ title: "Joke MongoDB", keyword: "MongoDB is a joke?" });
bulk.insert({
  title: "MongoDB vs Hadoop",
  keyword: "MongoDB is better than Hadoop?",
});
bulk.insert({ title: "MongoDB user guide", keyword: "how to use mongodb" });
var result = bulk.execute();
printjson(result);
print("");

print("======================  text index  ================================");
result = coll.createIndex(
  { title: "text", keyword: "text" },
  { name: "text_index", weights: { title: 10, keyword: 5 } }
);
print("*** ***  create index: ", tojson(result));
print("");

print("======================  find  ================================");
var cursor = coll
  .find(
    { $text: { $search: "MongoDB Hadoop" } },
    { level: { $meta: "textScore" } }
  )
  .sort({ level: { $meta: "textScore" } });
printjson(cursor.toArray());
print("");

cursor = coll
  .find(
    { $text: { $search: "MongoDB -joke" } },
    { level: { $meta: "textScore" } }
  )
  .sort({ level: { $meta: "textScore" } });
printjson(cursor.toArray());
print("");
