// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");
print("drop collection: ", coll.drop());

print("================  bulk  =======================");
var bulk = coll.initializeUnorderedBulkOp();
for (var i = 10000; i < 10100; i++) {
  bulk.insert({ _id: i, text: "hello mongo" });
}
var result = bulk.execute();
printjson(result);

// print("================  find next hasNext objsLeftInBatch  =======================");
// var cursor = coll.find({}, {"_id": 1});
// while(cursor.hasNext())
// {
//     print("Document: ", tojson(cursor.next()));
//     print("Left In Batch: ", cursor.objsLeftInBatch());
// }

// print("===================  find toArray  ==========================");
// var arr = coll.find().toArray();
// if(arr.length >= 10){
//     var obj = arr[10];
//     printjson(obj);
// }

print("====================  find forEach  ============================");
var cursor = coll.find();
cursor.forEach(function (doc) {
  if (doc["_id"] == 10010) {
    print(tojson(doc));
  }
});
