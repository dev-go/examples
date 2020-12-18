// Copyright (c) 2020, devgo.club
// All rights reserved.

var service = connect("localhost:27017");
var db = service.getSiblingDB("demo");
var coll = db.getCollection("zip_codes");

// print("===============  population more than 10,000,000  =========================")
// var cursor = coll.aggregate([
//     { "$group": { "_id": "$state", "total_pop": { "$sum": "$pop" } } },
//     { "$match": { "total_pop": { "$gte": 10000000 } } }
// ])
// printjson(cursor.toArray());

// print("===============  average population of every state   =========================")
// var cursor = coll.aggregate([
//     {
//         "$group": {
//             "_id": { "state": "$state", "city": "$city" },
//             "total_pop": { "$sum": "$pop" }
//         }
//     },
//     {
//         "$group": {
//             "_id": "$_id.state",
//             "avg_pop": { "$avg": "$total_pop" }
//         }
//     }
// ])
// printjson(cursor.toArray());

// print("====================  most population and least population city of every state  ===============================");
// var cursor = coll.aggregate([
//     { "$group": { "_id": { "state": "$state", "city": "$city" }, "city_pop": { "$sum": "$pop" } } },
//     { "$sort": { "city_pop": 1 } },
//     { "$group": { "_id": "$_id.state", "biggest_city": { "$last": "$_id.city" }, "biggest_pop": { "$last": "$city_pop" }, "smallest_city": { "$first": "$_id.city" }, "smallest_pop": { "$first": "$city_pop" } } },
//     { "$project": { "_id": 0, "state": "$_id", "biggest": { "city": "$biggest_city", "pop": "$biggest_pop" }, "smallest": { "city": "$smallest_city", "pop": "$smallest_pop" } } }
// ]);
// printjson(cursor.toArray());

print("====================  distinct state  ===========================");
var result = coll.distinct("state");
printjson(result);
