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
import java.util.concurrent.ArrayBlockingQueue;

import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.common.TopicPartition;

public class ConsumerControlFlowDemo {
    public static void main(String[] args) {
        Map<TopicPartition, ArrayBlockingQueue<ConsumerRecord<String, String>>> queues = new HashMap<>();
        Map<TopicPartition, Boolean> pauseTopicPartitions = new HashMap<>();
        Map<TopicPartition, Boolean> resumeTopicPartitions = new HashMap<>();

        new Thread(new Receiver(queues, pauseTopicPartitions, resumeTopicPartitions)).start();

        Map<TopicPartition, Boolean> startedProcessors = new HashMap<>();
        for (;;) {
            System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            try {
                synchronized (queues) {
                    queues.wait();
                    if (queues.size() != startedProcessors.size()) {
                        for (Entry<TopicPartition, ArrayBlockingQueue<ConsumerRecord<String, String>>> entry : queues
                                .entrySet()) {
                            if (!startedProcessors.containsKey(entry.getKey())) {
                                System.out.printf("+++++++++++[### MAIN] start processor: topic=%s, partition=%d\n",
                                        entry.getKey().topic(), entry.getKey().partition());
                                new Thread(new Processor(entry.getValue(), pauseTopicPartitions, resumeTopicPartitions))
                                        .start();
                                startedProcessors.put(entry.getKey(), true);
                            }
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}

class Receiver implements Runnable {
    private static String topicName = "hello";

    private static String consumerGroup = "hello-cg";

    private Map<TopicPartition, ArrayBlockingQueue<ConsumerRecord<String, String>>> queues;

    private Map<TopicPartition, Boolean> pauseTopicPartitions;

    private Map<TopicPartition, Boolean> resumeTopicPartitions;

    public Receiver(Map<TopicPartition, ArrayBlockingQueue<ConsumerRecord<String, String>>> queues,
            Map<TopicPartition, Boolean> pauseTopicPartitions, Map<TopicPartition, Boolean> resumeTopicPartitions) {
        this.queues = queues;
        this.pauseTopicPartitions = pauseTopicPartitions;
        this.resumeTopicPartitions = resumeTopicPartitions;
    }

    private Properties getProperties() {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "127.0.0.1:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, consumerGroup);
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringDeserializer");
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringDeserializer");
        return props;
    }

    @Override
    public void run() {
        Consumer<String, String> consumer = null;
        try {
            consumer = new KafkaConsumer<>(getProperties());
            consumer.subscribe(Arrays.asList(topicName));
            Map<TopicPartition, OffsetAndMetadata> offsets = new HashMap<>();
            for (;;) {
                for (Entry<TopicPartition, OffsetAndMetadata> entry : offsets.entrySet()) {
                    consumer.seek(entry.getKey(), entry.getValue());
                }
                synchronized (resumeTopicPartitions) {
                    consumer.resume(resumeTopicPartitions.keySet());
                    for (TopicPartition topicPartition : resumeTopicPartitions.keySet()) {
                        System.out.printf("+++++++++++[### RECEIVER] resume topic partition: topic=%s, partition=%d\n",
                                topicPartition.topic(), topicPartition.partition());
                    }
                    resumeTopicPartitions.clear();
                }
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(1000));
                for (TopicPartition topicPartition : records.partitions()) {
                    for (ConsumerRecord<String, String> record : records.records(topicPartition)) {
                        ArrayBlockingQueue<ConsumerRecord<String, String>> queue = null;
                        synchronized (this.queues) {
                            queue = this.queues.get(topicPartition);
                            if (queue == null) {
                                queue = new ArrayBlockingQueue<>(10);
                                this.queues.put(topicPartition, queue);
                                this.queues.notifyAll();
                            }
                        }
                        boolean ok = queue.offer(record);
                        if (!ok) {
                            synchronized (this.pauseTopicPartitions) {
                                consumer.pause(Arrays.asList(topicPartition));
                                this.pauseTopicPartitions.put(topicPartition, true);
                                System.out.printf(
                                        "+++++++++++[### RECEIVER] pause topic partition: topic=%s, partition=%d\n",
                                        topicPartition.topic(), topicPartition.partition());
                                break;
                            }
                        } else {
                            offsets.put(topicPartition, new OffsetAndMetadata(record.offset() + 1));
                        }
                    }
                }
                consumer.commitSync(offsets);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (consumer != null) {
                consumer.close();
            }
        }
    }
}

class Processor implements Runnable {
    private ArrayBlockingQueue<ConsumerRecord<String, String>> queue;

    private Map<TopicPartition, Boolean> pauseTopicPartitions;

    private Map<TopicPartition, Boolean> resumeTopicPartitions;

    public Processor(ArrayBlockingQueue<ConsumerRecord<String, String>> queue,
            Map<TopicPartition, Boolean> pauseTopicPartitions, Map<TopicPartition, Boolean> resumeTopicPartitions) {
        this.queue = queue;
        this.pauseTopicPartitions = pauseTopicPartitions;
        this.resumeTopicPartitions = resumeTopicPartitions;
    }

    @Override
    public void run() {
        for (;;) {
            try {
                ConsumerRecord<String, String> record = queue.take();
                TopicPartition partition = new TopicPartition(record.topic(), record.partition());
                boolean flag = false;
                synchronized (pauseTopicPartitions) {
                    flag = pauseTopicPartitions.remove(partition) != null;
                    if (flag) {
                        synchronized (resumeTopicPartitions) {
                            resumeTopicPartitions.put(partition, true);
                        }
                    }
                }
                Thread.sleep(new Random().nextInt(10000));
                System.out.printf(
                        "+++++++++++[### PROCESSOR %d] record: topic=%s, partition=%d, offset=%d, key=%s, value=%s\n",
                        record.partition(), record.topic(), record.partition(), record.offset(), record.key(),
                        record.value());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}