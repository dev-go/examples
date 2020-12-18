// Copyright (c) 2020, devgo.club
// All rights reserved.

package main

import (
	"context"
	"encoding/json"
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

	for _, endpoint := range endpoints {
		rsp, err := cli.Status(context.TODO(), endpoint)
		if err != nil {
			log.Printf("get endpoint status failed: %v, endpoint=%v", err, endpoint)
			continue
		}
		b, err := json.Marshal(rsp)
		if err != nil {
			log.Printf("marshal endpoint status to json failed: %v, endpoint_status=%v, endpoint=%v", err, rsp, endpoint)
			continue
		}
		log.Printf("get endpoint status: ok, rsp=%s, endpoint=%v", b, endpoint)
		// get endpoint status: ok, rsp={"header":{"cluster_id":3228993907379709341,"member_id":4018967532750976579,"revision":16,"raft_term":35},"version":"3.4.10","dbSize":24576,"leader":8453901024887191321,"raftIndex":39,"raftTerm":35}, endpoint=127.0.0.1:9002
		// get endpoint status: ok, rsp={"header":{"cluster_id":3228993907379709341,"member_id":7667007706100653651,"revision":16,"raft_term":35},"version":"3.4.10","dbSize":24576,"leader":8453901024887191321,"raftIndex":39,"raftTerm":35}, endpoint=127.0.0.1:9004
		// get endpoint status: ok, rsp={"header":{"cluster_id":3228993907379709341,"member_id":8453901024887191321,"revision":16,"raft_term":35},"version":"3.4.10","dbSize":24576,"leader":8453901024887191321,"raftIndex":39,"raftTerm":35}, endpoint=127.0.0.1:9006

	}
	return
}
