// Copyright (c) 2020, devgo.club
// All rights reserved.

package club.devgo.demo.consumer;

import java.time.Duration;
import java.util.Arrays;
import java.util.Properties;

import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

public class ConsumerDemo {
    private static final String TOPIC_NAME = "hello";

    private static final String CONSUMER_GROUP = "hello-cg";

    public static Properties getProperties() {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "127.0.0.1:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, CONSUMER_GROUP);
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true");
        props.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "1000");
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
            for (;;) {
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(60000));
                for (ConsumerRecord<String, String> record : records) {
                    System.out.printf("[INF] record: key=%s, value=%s, partition=%d, offset=%d\n", record.key(),
                            record.value(), record.partition(), record.offset());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (consumer != null) {
                consumer.close();
            }
        }
    }

    public static void main(String[] args) {
        receive();
    }
}