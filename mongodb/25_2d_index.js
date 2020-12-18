// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("address");
print("drop collection: ", tojson(coll.drop()));

print("========================  bulk  =========================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({ _id: "A", loc: [0.001, 0.002] });
bulk.insert({ _id: "B", loc: [0.75, 0.75] });
bulk.insert({ _id: "C", loc: [0.5, 0.5] });
bulk.insert({ _id: "D", loc: [-0.5, -0.5] });
var result = bulk.execute();
printjson(result);
print("");

print("=======================  2d index  ========================");
result = coll.createIndex({ loc: "2d" }, { min: -1, max: 1 });
print("*** ***  create index: ", tojson(result));

print("=======================  $geoWithin  ========================");
var cursor = coll.find({
  loc: {
    $geoWithin: {
      $box: [
        [0.25, 0.25],
        [1, 1],
      ],
    },
  },
});
printjson(cursor.toArray());

print("=======================  $near  ========================");
cursor = coll.find({ loc: { $near: [0, 0], $maxDistance: 0.75 } });
printjson(cursor.toArray());
