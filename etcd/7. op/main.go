// Copyright (c) 2020, devgo.club
// All rights reserved.

package main

import (
	"context"
	"log"
	"strings"
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
		log.Printf("connect etcd failed: %v", err)
		return
	}
	var prefix = "/locker/user/"
	var startKey = prefix
	for {
		opResp, err := cli.KV.Do(context.TODO(), clientv3.OpGet(startKey, clientv3.WithFromKey(), clientv3.WithLimit(2)))
		if err != nil {
			log.Printf("op failed: %v", err)
			return
		}
		log.Printf("op response: header=%v", opResp.Get().Header)
		log.Printf("op response: count=%v", opResp.Get().Count)
		log.Printf("op response: more=%v", opResp.Get().More)
		var flag = opResp.Get().More
		for _, kv := range opResp.Get().Kvs {
			if strings.HasPrefix(string(kv.Key), prefix) {
				log.Printf("op response: kv=%v", kv)
				startKey = string(kv.Key) + "\x00"
			} else {
				flag = false
				break
			}
		}
		if !flag {
			break
		}
	}
}
