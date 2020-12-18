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

	ctx, cancelFunc := context.WithTimeout(context.TODO(), 5*time.Second)
	defer cancelFunc()
	rsp, err := cli.KV.Get(ctx, "/hello/", clientv3.WithPrefix())
	if err != nil {
		log.Printf("get failed: %v", err)
		return
	}
	log.Printf("get response: header=%v, count=%v, more=%v", rsp.Header, rsp.Count, rsp.More)
	// header=cluster_id:3228993907379709341 member_id:4018967532750976579 revision:17 raft_term:35 , count=2, more=false
	if rsp.Count > 0 && len(rsp.Kvs) > 0 {
		for _, kv := range rsp.Kvs {
			log.Printf("get response: kv=%v", kv)
			// kv=key:"/hello/go" create_revision:12 mod_revision:12 version:1 value:"go"
			// kv=key:"/hello/java" create_revision:13 mod_revision:13 version:1 value:"java"
		}
	}
	return
}
