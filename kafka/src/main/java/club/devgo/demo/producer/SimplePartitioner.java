// Copyright (c) 2020, devgo.club
// All rights reserved.

package club.devgo.demo.producer;

import java.util.Map;

import org.apache.kafka.clients.producer.Partitioner;
import org.apache.kafka.common.Cluster;

public class SimplePartitioner implements Partitioner {
    @Override
    public void configure(Map<String, ?> configs) {
    }

    @Override
    public int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes, Cluster cluster) {
        int partitionId = 0;
        try {
            partitionId = Integer.parseInt(key.toString().substring(4)) % 2;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return partitionId;
    }

    @Override
    public void close() {
    }
}