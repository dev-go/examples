// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("records");
print("drop collection: ", tojson(coll.drop()));

print("====================  bulk  ======================");
var bulk = coll.initializeOrderedBulkOp();
bulk.insert({
  cust_id: "A123",
  amount_price: 500,
  goods: "apple",
  status: "A",
});
bulk.insert({
  cust_id: "A123",
  amount_price: 300,
  goods: "orage",
  status: "D",
});
bulk.insert({
  cust_id: "B212",
  amount_price: 200,
  goods: "banana",
  status: "A",
});
bulk.insert({
  cust_id: "A123",
  amount_price: 250,
  goods: "apple",
  status: "A",
});
bulk.insert({
  cust_id: "A123",
  amount_price: 300,
  goods: "orage",
  status: "A",
});
var result = bulk.execute();
printjson(result);

print("====================  aggregate  ==========================");
var cursor = coll.aggregate([
  { $match: { status: "A" } },
  {
    $group: {
      _id: "$cust_id",
      total_price: { $sum: "$amount_price" },
      goods_set: { $addToSet: "$goods" },
    },
  },
  { $sort: { total: -1 } },
]);
printjson(cursor.toArray());
