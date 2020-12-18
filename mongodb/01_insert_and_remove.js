// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("student");

print("drop collection: ", coll.drop());

var stu = {
  name: "liu",
  age: NumberInt(18),
  address: {
    province: "shandong",
    city: "jinan",
  },
};
print("=======  insert  ==============");
printjson(coll.insert(stu));
printjson(coll.insert(stu));
printjson(coll.insert(stu));
printjson(coll.insert(stu));
printjson(coll.insert(stu));
printjson(coll.insert(stu));

print("======  find  =================");
var cursor = coll.find();
printjson(cursor.toArray());

print("====== remove justOne =================");
printjson(coll.remove({ age: NumberInt(18) }, true));
print("====== remove all =================");
printjson(coll.remove({ age: NumberInt(18) }, false));
