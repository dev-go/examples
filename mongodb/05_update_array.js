// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");

print("drop collection: ", coll.drop());

print("==============  bulk  ==================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({ _id: NumberInt(135139), score: [60, 60, 61, 62] });
bulk.insert({ _id: NumberInt(135141), score: [69, 60, 61, 68] });
bulk.insert({ _id: NumberInt(135143), score: [] });
var result = bulk.execute();
printjson(result);

print("==============  find  ==================");
var cursor = coll.find();
printjson(cursor.toArray());

// print("==============  update  $  ================");
// result = coll.update({"score": 60}, {"$set": {"score.$": 99}}, {"multi": true});
// printjson(result);
//
// print("==============  find  ==================");
// cursor = coll.find();
// printjson(cursor.toArray());

// print("==============  update  $pop  ================");
// // {"$pop": {"filed": n}}  n>0 trail  n<0 head
// result = coll.update({"score": 60}, {"$pop": {"score": -1}}, {"multi": true});
// printjson(result);
//
// print("==============  find  ==================");
// cursor = coll.find();
// printjson(cursor.toArray());

// print("==============  update  $pull  ================");
// result = coll.update({"score": 60}, {"$pull": {"score": {"$gte": 63}}}, {"multi": true});
// printjson(result);
//
// print("==============  find  ==================");
// cursor = coll.find();
// printjson(cursor.toArray());

// print("==============  update  $pullAll  ================");
// result = coll.update({"score": 60}, {"$pullAll": {"score": [68, 60]}}, {"multi": true});
// printjson(result);
//
// print("==============  find  ==================");
// cursor = coll.find();
// printjson(cursor.toArray());

// print("==============  update  $push  ================");
// result = coll.update({}, {"$push": {"score": 99}}, {"multi": true});
// printjson(result);
//
// print("==============  find  ==================");
// cursor = coll.find();
// printjson(cursor.toArray());

// print("==============  update  $push  ================");
// result = coll.update({}, {"$push": {"score": [1, 2, 3]}}, {"multi": true});
// printjson(result);
//
// print("==============  find  ==================");
// cursor = coll.find();
// printjson(cursor.toArray());

// print("==============  update  $push + $each + $position  ================");
// result = coll.update({}, {"$push": {"score": {"$each": [1, 2, 3], "$slice": 6, "$position": 2}}}, {"multi": true});
// printjson(result);
//
// print("==============  find  ==================");
// cursor = coll.find();
// printjson(cursor.toArray());

print(
  "==============  update  $push + $each + $sort + $slice  ================"
);
result = coll.update(
  { _id: NumberInt(135139) },
  {
    $push: {
      score: {
        $each: [
          { subject: "English", score: 55 },
          { subject: "Math", score: 77 },
          { subject: "Chinese", score: 66 },
          { subject: "Sport", score: 99 },
          { subject: "History", score: 88 },
        ],
        $slice: 4,
        $sort: { score: -1 },
      },
    },
  }
);
printjson(result);

print("==============  find  ==================");
cursor = coll.find();
printjson(cursor.toArray());
