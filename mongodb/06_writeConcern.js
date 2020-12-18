// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");

print("drop collection: ", coll.drop());

var d = {
  name: "Liu",
  age: NumberInt(18),
  address: { province: "Shandong", city: "Ti'an" },
};

print("============== writeConcern: {w: 0} =======================");
printjson(coll.insert(d, { writeConcern: { w: 0 } }));

print("============== writeConcern: {w: 1} =======================");
printjson(coll.insert(d, { writeConcern: { w: 1 } }));

print(
  "============== writeConcern: {w: 1, j: true, wtimeout: 5000}  ======================="
);
printjson(coll.insert(d, { writeConcern: { w: 1, j: true, wtimeout: 5000 } }));
