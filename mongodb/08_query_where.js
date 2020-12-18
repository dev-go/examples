// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");
print("drop collection: ", coll.drop());

print("==============  bulk  ================");
var bulk = coll.initializeUnorderedBulkOp();
bulk.insert({ apple: 1, banana: 6, peach: 4 });
bulk.insert({ apple: 3, banana: 3, peach: 4 });
var result = bulk.execute();
printjson(result);

print("==============  find  ================");
var cursor = coll.find();
printjson(cursor.toArray());

print("==============  find $where  =========");
cursor = coll.find({ $where: "this.apple==1 && this.banana==6" });
printjson(cursor.toArray());

print("==============  find $where  =========");
cursor = coll.find({
  $where: function () {
    for (var k1 in this) {
      for (var k2 in this) {
        if (k1 != k2 && this[k1] == this[k2]) {
          return true;
        }
      }
    }
  },
});
printjson(cursor.toArray());
