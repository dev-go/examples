// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var collID = db.getCollection("id");
print("drop 'id' collection: ", collID.drop());
var collStudent = db.getCollection("student");
print("drop 'student' collection: ", collStudent.drop());

// coll.insert({"key": "student_id", "seq": NumberInt(0)});

function getNextID(key) {
  var obj = collID.findAndModify({
    query: { key: key },
    update: { $inc: { seq: NumberInt(1) } },
    new: true,
    upsert: true,
  });
  return obj["seq"];
}

for (var i = 0; i < 10; i++) {
  var id = getNextID("student_id");
  collStudent.insert({ _id: id, name: "student_" + id });
}

print("=================  find student  ==================");
var cursor = collStudent.find();
printjson(cursor.toArray());

print("=================  find id  =======================");
cursor = collID.find();
printjson(cursor.toArray());
