// Copyright (c) 2020, devgo.club
// All rights reserved.

package main

import (
	"context"
	"log"
	"time"

	"github.com/coreos/etcd/clientv3"
)

func init() {
	log.SetFlags(log.Lshortfile | log.Ltime)
}

func main() {
	var endpoints = []string{
		"127.0.0.1:9002",
		"127.0.0.1:9004",
		"127.0.0.1:9006",
	}
	var config = clientv3.Config{
		Endpoints:   endpoints,
		DialTimeout: 5 * time.Second,
	}
	cli, err := clientv3.New(config)
	if err != nil {
		log.Printf("connect etcd failed: %v, endpoints=%v", err, endpoints)
		return
	}

	// rsp, err := cli.KV.Delete(context.TODO(), "hello", clientv3.WithPrevKV())
	// if err != nil {
	// 	log.Printf("delete failed: %v", err)
	// 	return
	// }
	// log.Printf("delete response: header=%v", rsp.Header)
	// // header=cluster_id:3228993907379709341 member_id:8453901024887191321 revision:20 raft_term:36
	// log.Printf("delete response: deleted=%v", rsp.Deleted)
	// // deleted=1
	// if len(rsp.PrevKvs) > 0 {
	// 	for _, prevKV := range rsp.PrevKvs {
	// 		log.Printf("delete response: prev_kv=%v", prevKV)
	// 		// prev_kv=key:"hello" create_revision:2 mod_revision:19 version:16 value:"world"
	// 	}
	// }

	rsp, err := cli.KV.Delete(context.TODO(), "/hello/", clientv3.WithPrefix(), clientv3.WithPrevKV())
	if err != nil {
		log.Printf("delete failed: %v", err)
		return
	}
	log.Printf("delete response: header=%v", rsp.Header)
	// header=cluster_id:3228993907379709341 member_id:7667007706100653651 revision:21 raft_term:36
	log.Printf("delete response: deleted=%v", rsp.Deleted)
	// deleted=2
	if len(rsp.PrevKvs) > 0 {
		for _, prevKV := range rsp.PrevKvs {
			log.Printf("delete response: prev_kv=%v", prevKV)
			// prev_kv=key:"/hello/go" create_revision:12 mod_revision:12 version:1 value:"go"
			// prev_kv=key:"/hello/java" create_revision:13 mod_revision:13 version:1 value:"java"
		}
	}
	return
}
