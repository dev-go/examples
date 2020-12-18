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
		log.Printf("connect etcd failed: %v", err)
		return
	}

	// method 1 >>>
	// lease, err := cli.Lease.Grant(context.TODO(), 10)
	// if err != nil {
	// 	log.Printf("create lease failed: %v", err)
	// 	return
	// }
	// method 1 <<<

	// method 2 >>>
	// lease, err := cli.Lease.Grant(context.TODO(), 10)
	// if err != nil {
	// 	log.Printf("create lease failed: %v", err)
	// 	return
	// }
	// go func() {
	// 	rspCh, err := cli.Lease.KeepAlive(context.TODO(), lease.ID)
	// 	if err != nil {
	// 		log.Printf("keep alive failed: %v", err)
	// 		return
	// 	}
	// 	for rsp := range rspCh {
	// 		log.Printf("keep alive response: ttl=%v", rsp.TTL)
	// 	}
	// }()
	// method 2 <<<

	// method 3 >>>
	lease, err := cli.Lease.Grant(context.TODO(), 10)
	if err != nil {
		log.Printf("create lease failed: %v", err)
		return
	}
	go func() {
		ctx, cancelFunc := context.WithTimeout(context.TODO(), 20*time.Second)
		defer cancelFunc()
		rspCh, err := cli.Lease.KeepAlive(ctx, lease.ID)
		if err != nil {
			log.Printf("keep alive failed: %v", err)
			return
		}
	L:
		for {
			select {
			case rsp := <-rspCh:
				if rsp == nil {
					break L
				}
				log.Printf("keep alive response: rsp_ttl=%v", rsp.TTL)
			case <-ctx.Done():
				log.Printf("keep alive context done!")
				break L
			}
		}
	}()
	// method 3 <<<

	rsp, err := cli.KV.Put(context.TODO(), "/locker/user/1001", "xxx", clientv3.WithLease(lease.ID))
	if err != nil {
		log.Printf("put failed: %v", err)
		return
	}
	log.Printf("put response: header=%v", rsp.Header)
	for i := 0; ; i++ {
		time.Sleep(1 * time.Second)
		log.Printf("\n\n")
		rsp, err := cli.KV.Get(context.TODO(), "/locker/user/1001")
		if err != nil {
			log.Printf("get failed: %v, i=%v", err, i)
			continue
		}
		log.Printf("get response: header=%v, count=%v, more=%v, i=%v", rsp.Header, rsp.Count, rsp.More, i)
		if len(rsp.Kvs) > 0 {
			for _, kv := range rsp.Kvs {
				log.Printf("get response: kv=%v, i=%v", kv, i)
			}
		} else {
			log.Printf("deleted ...")
			break
		}
	}
	log.Printf("over!")
}
