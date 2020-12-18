// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("address");
print("drop collection: ", coll.drop());

print("=================  bulk  =======================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({
  name: "Beijing, Xicheng, Gulou",
  loc: { type: "Point", coordinates: [116.393453, 39.962571] },
});
bulk.insert({
  name: "Beijing, Xicheng, Yongdingmen",
  loc: { type: "Point", coordinates: [116.405738, 39.878415] },
});
bulk.insert({
  name: "Beijing, Dongcheng, Chang'anjie",
  loc: { type: "Point", coordinates: [116.403982, 39.915425] },
});
bulk.insert({
  name: "Gulou-Cheng'anjie-Yongdingmen",
  loc: {
    type: "Polygon",
    coordinates: [
      [
        [116.393453, 39.962571],
        [116.403982, 39.915425],
        [116.405738, 39.878415],
        [116.393453, 39.962571],
      ],
    ],
  },
});
var result = bulk.execute();
printjson(result);
print("");

print("=================  2dsphere index  ======================");
result = coll.createIndex({ loc: "2dsphere" });
print("*** ***  create index: ", tojson(result));

// print("====================  $geoWithin  =======================");
// var cursor = coll.find({"loc": {"$geoWithin": {"$geometry": {
//     "type": "Polygon",
//     "coordinates": [[
// 	    [116.293545, 39.982595],
// 	    [116.481420, 39.982014],
// 	    [116.484214, 39.850226],
// 	    [116.296576, 39.837899],
// 	    [116.293545, 39.982595]
//     ]]
// }}}});
// printjson(cursor.toArray());

// print("===================  $geoIntersects  ===================");
// var cursor = coll.find({"loc": {"$geoIntersects": {"$geometry": {
//     "type": "Polygon",
//     "coordinates": [[
// 	    [116.293545, 39.982595],
// 	    [116.481420, 39.982014],
// 	    [116.484214, 39.850226],
// 	    [116.296576, 39.837899],
// 	    [116.293545, 39.982595]
//     ]]
// }}}});
// printjson(cursor.toArray());

print("=======================  $near  =============================");
var cursor = coll.find({
  loc: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [116.403982, 39.915425],
      },
      $minDistance: 4200,
      $maxDistance: 6000,
    },
  },
});
printjson(cursor.toArray());
