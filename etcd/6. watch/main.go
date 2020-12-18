// Copyright (c) 2020, devgo.club
// All rights reserved.

package main

import (
	"context"
	"log"
	"strconv"
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

	getResp, err := cli.KV.Get(context.TODO(), "/locker/user/", clientv3.WithPrefix())
	if err != nil {
		log.Printf("get response failed: %v", err)
		return
	}
	log.Printf("get response: header=%v, count=%v, more=%v", getResp.Header, getResp.Count, getResp.More)
	for _, kv := range getResp.Kvs {
		log.Printf("get response: kv=%v", kv)
	}

	ctx, cancelFunc := context.WithCancel(context.TODO())

	go func() {
		for i := 0; i < 6; i++ {
			time.Sleep(time.Second)
			var key = "/locker/user/" + strconv.Itoa(i)
			var value = "xxx" + strconv.Itoa(i)
			cli.KV.Put(context.TODO(), key, value)
		}
		time.Sleep(10 * time.Second)
		cancelFunc()
	}()

	var watchRespCh = cli.Watcher.Watch(ctx, "/locker/user/", clientv3.WithPrefix(), clientv3.WithRev(getResp.Header.Revision+1))
	for watchResp := range watchRespCh {
		log.Printf("\n\n-------------------------------------------")
		log.Printf("watch response: header=%v", watchResp.Header)
		log.Printf("watch response: canceled=%v", watchResp.Canceled)
		log.Printf("watch response: created=%v", watchResp.Created)
		for _, event := range watchResp.Events {
			log.Printf("watch response: event=%v", event)
		}
	}
}
