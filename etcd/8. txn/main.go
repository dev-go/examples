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

	lease, err := cli.Lease.Grant(context.TODO(), 10)
	if err != nil {
		log.Printf("create lease failed: %v", err)
		return
	}
	var ch = make(chan struct{}, 1)
	defer func() { <-ch }()
	ctx, cancelFunc := context.WithCancel(context.TODO())
	defer cli.Lease.Revoke(context.TODO(), lease.ID)
	defer cancelFunc()
	go func() {
		keepAliveRespCh, err := cli.Lease.KeepAlive(ctx, lease.ID)
		if err != nil {
			log.Printf("keep alive failed: %v", err)
			return
		}
		for keepAliveResp := range keepAliveRespCh {
			log.Printf("keep alive: success, resp=%v", keepAliveResp)
		}
		log.Printf("keep alive: over!")
		ch <- struct{}{}
	}()

	rsp, err := cli.KV.Txn(context.TODO()).If(
		clientv3.Compare(clientv3.CreateRevision("/locker/user/66"), "=", 0),
	).Then(
		clientv3.OpPut("/locker/user/66", "xxx", clientv3.WithLease(lease.ID)),
	).Else(
		clientv3.OpGet("/locker/user/66"),
	).Commit()

	if err != nil {
		log.Printf("commit txn failed: %v", err)
		return
	}

	if !rsp.Succeeded {
		log.Printf("require locker failed: rsp=%v", rsp.Responses)
		return
	}
	log.Printf("require locker: ok, rsp=%v", rsp.Responses)

	// do something
	log.Printf(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
	time.Sleep(10 * time.Second)
	log.Printf("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
	return
}
