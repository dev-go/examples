// Copyright (c) 2020, devgo.club
// All rights reserved.

package club.devgo.demo.producer;

import java.util.Properties;

import org.apache.kafka.clients.producer.Callback;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;

public class ProducerDemo {
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
        return props;
    }

    public static void sendAsync() {
        Producer<String, String> producer = null;
        try {
            producer = new KafkaProducer<>(getProperties());
            for (int i = 0; i < 10; i++) {
                String key = "key_" + i;
                producer.send(new ProducerRecord<String, String>(TOPIC_NAME, key, "value_" + i));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (producer != null) {
                producer.close();
            }
        }
    }

    public static void sendBlock() {
        Producer<String, String> producer = null;
        try {
            producer = new KafkaProducer<>(getProperties());
            for (int i = 0; i < 10; i++) {
                String key = "key_" + i + "_" + i;
                RecordMetadata metadata = producer
                        .send(new ProducerRecord<String, String>(TOPIC_NAME, key, "value_" + i + "_" + i)).get();
                System.out.printf("key: %s, partition: %d, offset: %d\n", key, metadata.partition(), metadata.offset());
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (producer != null) {
                producer.close();
            }
        }
    }

    public static void sendCallback() {
        Producer<String, String> producer = null;
        try {
            producer = new KafkaProducer<>(getProperties());
            for (int i = 0; i < 10; i++) {
                String key = "key_" + i + "_" + i + "_" + i;
                producer.send(new ProducerRecord<String, String>(TOPIC_NAME, key, "value_" + i + "_" + i + "_" + i),
                        new Callback() {
                            @Override
                            public void onCompletion(RecordMetadata metadata, Exception exception) {
                                if (exception != null) {
                                    exception.printStackTrace();
                                } else {
                                    System.out.printf("key: %s, partition: %d, offset: %d\n", key, metadata.partition(),
                                            metadata.offset());
                                }
                            }
                        });
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (producer != null) {
                producer.close();
            }
        }
    }

    public static void main(String[] args) {
        // sendAsync();
        // sendBlock();
        sendCallback();
    }
}