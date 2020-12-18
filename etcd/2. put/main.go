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

	// method 1: >>>
	// rsp, err := cli.KV.Put(ctx, "hello", "world", clientv3.WithPrevKV())
	// method 1: <<<

	// method 2: >>>
	rsp, err := clientv3.NewKV(cli).Put(ctx, "hello", "world", clientv3.WithPrevKV())
	// method 2: <<<

	if err != nil {
		log.Printf("put failed: %v", err)
		return
	}
	log.Printf("put response: header=%v", rsp.Header)
	// header=cluster_id:3228993907379709341 member_id:7667007706100653651 revision:17 raft_term:35
	if rsp.PrevKv != nil {
		log.Printf("put response: prev_kv=%v", rsp.PrevKv)
		// prev_kv=key:"hello" create_revision:2 mod_revision:16 version:13 value:"world"
	}
	return
}
