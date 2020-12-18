// Copyright (c) 2020, devgo.club
// All rights reserved.

package club.devgo.demo.producer;

import java.util.Properties;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;

public class ProducerExactlyOnceDemo {
    private static final String TOPIC_NAME = "hello";

    public static Properties getProperties() {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "127.0.0.1:9092");
        props.put(ProducerConfig.ACKS_CONFIG, "all");
        props.put(ProducerConfig.RETRIES_CONFIG, "3");
        props.put(ProducerConfig.BATCH_SIZE_CONFIG, "16384");
        props.put(ProducerConfig.LINGER_MS_CONFIG, "1000");
        props.put(ProducerConfig.BUFFER_MEMORY_CONFIG, "33554432");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringSerializer");
        props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, "true");
        props.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, "hello-tx");
        return props;
    }

    public static void sendExactlyOnce() {
        Producer<String, String> producer = null;
        try {
            producer = new KafkaProducer<>(getProperties());
            producer.initTransactions();
            producer.beginTransaction();
            producer.send(new ProducerRecord<String, String>(TOPIC_NAME, "key-1", "value-1"));
            producer.send(new ProducerRecord<String, String>(TOPIC_NAME, "key-2", "value-2"));
            producer.commitTransaction();
        } catch (Exception e) {
            e.printStackTrace();
            if (producer != null) {
                producer.abortTransaction();
            }
        } finally {
            if (producer != null) {
                producer.close();
            }
        }
    }

    public static void main(String[] args) {
        sendExactlyOnce();
    }
}