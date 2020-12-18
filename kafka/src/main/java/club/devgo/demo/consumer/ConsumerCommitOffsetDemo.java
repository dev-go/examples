// Copyright (c) 2020, devgo.club
// All rights reserved.

package club.devgo.demo.consumer;

import java.time.Duration;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Random;
import java.util.Map.Entry;

import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.clients.consumer.OffsetCommitCallback;
import org.apache.kafka.common.TopicPartition;

public class ConsumerCommitOffsetDemo {
    private static final String TOPIC_NAME = "hello";

    private static final String CONSUMER_GROUP = "hello-cg";

    public static Properties getProperties() {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "127.0.0.1:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, CONSUMER_GROUP);
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringDeserializer");
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringDeserializer");
        return props;
    }

    public static void receive() {
        Consumer<String, String> consumer = null;
        try {
            consumer = new KafkaConsumer<>(getProperties());
            consumer.subscribe(Arrays.asList(TOPIC_NAME));
            Map<TopicPartition, OffsetAndMetadata> offsets = new HashMap<>();
            for (;;) {
                for (Entry<TopicPartition, OffsetAndMetadata> offset : offsets.entrySet()) {
                    consumer.seek(offset.getKey(), offset.getValue());
                }
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(60000));
                for (ConsumerRecord<String, String> record : records) {
                    if (process(record) != 0) {
                        break;
                    } else {
                        offsets.put(new TopicPartition(record.topic(), record.partition()),
                                new OffsetAndMetadata(record.offset() + 1));
                    }
                }
                consumer.commitAsync(offsets, new OffsetCommitCallback() {
                    @Override
                    public void onComplete(Map<TopicPartition, OffsetAndMetadata> offsets, Exception e) {
                        if (e != null) {
                            System.out.println("commit offsets async failed:");
                            e.printStackTrace();
                        } else {
                            System.out.println("commit offsets async success:");
                            offsets.entrySet().stream().forEach(System.out::println);
                        }
                    }
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (consumer != null) {
                consumer.close();
            }
        }
    }

    public static int process(ConsumerRecord<String, String> record) {
        if (new Random().nextInt(100) < 90) {
            System.out.printf("[INF] record: key=%s, value=%s, partition=%d, offset=%d\n", record.key(), record.value(),
                    record.partition(), record.offset());
            return 0;
        } else {
            System.out.printf("[ERR] record: key=%s, value=%s, partition=%d, offset=%d\n", record.key(), record.value(),
                    record.partition(), record.offset());
            return 1;
        }
    }

    public static void main(String[] args) {
        receive();
    }
}