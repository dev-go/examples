// Copyright (c) 2020, devgo.club
// All rights reserved.

package club.devgo.demo.admin;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.AlterConfigOp;
import org.apache.kafka.clients.admin.ConfigEntry;
import org.apache.kafka.clients.admin.ListTopicsOptions;
import org.apache.kafka.clients.admin.NewPartitions;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.common.config.ConfigResource;

public class AdminDemo {
    private static final String TOPIC_NAME = "hello";

    public static AdminClient getAdminClient() {
        Properties props = new Properties();
        props.setProperty(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, "127.0.0.1:9092");
        return AdminClient.create(props);
    }

    public static void createTopic() {
        AdminClient adminClient = null;
        try {
            adminClient = getAdminClient();
            NewTopic newTopic = new NewTopic(TOPIC_NAME, 1, (short) 1);
            adminClient.createTopics(Arrays.asList(newTopic)).all().get();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (adminClient != null) {
                adminClient.close();
            }
        }
    }

    public static void getTopicList(boolean showInternal) {
        AdminClient adminClient = null;
        try {
            adminClient = getAdminClient();
            adminClient.listTopics(new ListTopicsOptions().listInternal(showInternal)).names().get().stream()
                    .forEach(System.out::println);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (adminClient != null) {
                adminClient.close();
            }
        }
    }

    public static void deleteTopic() {
        AdminClient adminClient = null;
        try {
            adminClient = getAdminClient();
            adminClient.deleteTopics(Arrays.asList(TOPIC_NAME)).all().get();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (adminClient != null) {
                adminClient.close();
            }
        }
    }

    public static void getTopicInfo() {
        AdminClient adminClient = null;
        try {
            adminClient = getAdminClient();
            adminClient.describeTopics(Arrays.asList(TOPIC_NAME)).all().get().entrySet().forEach(System.out::println);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (adminClient != null) {
                adminClient.close();
            }
        }
    }

    public static void getConfigInfo() {
        AdminClient adminClient = null;
        try {
            adminClient = getAdminClient();
            adminClient.describeConfigs(Arrays.asList(new ConfigResource(ConfigResource.Type.TOPIC, TOPIC_NAME))).all()
                    .get().entrySet().forEach(System.out::println);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (adminClient != null) {
                adminClient.close();
            }
        }
    }

    public static void alterConfig() {
        AdminClient adminClient = null;
        try {
            adminClient = getAdminClient();
            Map<ConfigResource, Collection<AlterConfigOp>> configs = new HashMap<>();
            configs.put(new ConfigResource(ConfigResource.Type.TOPIC, TOPIC_NAME), Arrays
                    .asList(new AlterConfigOp(new ConfigEntry("preallocate", "false"), AlterConfigOp.OpType.SET)));
            adminClient.incrementalAlterConfigs(configs).all().get();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (adminClient != null) {
                adminClient.close();
            }
        }
    }

    public static void incrPartitionTo(int partitions) {
        AdminClient adminClient = null;
        try {
            adminClient = getAdminClient();
            Map<String, NewPartitions> newPartitions = new HashMap<>();
            newPartitions.put(TOPIC_NAME, NewPartitions.increaseTo(partitions));
            adminClient.createPartitions(newPartitions).all().get();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (adminClient != null) {
                adminClient.close();
            }
        }
    }

    public static void demo() {
        AdminClient adminClient = null;
        try {
            adminClient = getAdminClient();
            System.out.println(adminClient.describeCluster().clusterId().get());
            adminClient.describeCluster().nodes().get().forEach(System.out::println);
            adminClient.listConsumerGroups().all().get().forEach(System.out::println);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (adminClient != null) {
                adminClient.close();
            }
        }
    }

    public static void main(String[] args) {
        // System.out.println("### createTopic() >>> ");
        // createTopic();
        // System.out.println("### getTopicList(false) >>> ");
        // getTopicList(false);
        // System.out.println("### getTopicList(true) >>> ");
        // getTopicList(true);
        // System.out.println("### deleteTopic() >>> ");
        // deleteTopic();
        // System.out.println("### getTopicList(false) >>> ");
        // getTopicList(false);
        // System.out.println("### createTopic() >>> ");
        // createTopic();
        // System.out.println("### getTopicList(false) >>> ");
        // getTopicList(false);
        // System.out.println("### getTopicInfo() >>> ");
        // getTopicInfo();
        // System.out.println("### getConfigInfo() >>> ");
        // getConfigInfo();
        // System.out.println("### alterConfig() >>> ");
        // alterConfig();
        // System.out.println("### getConfigInfo() >>> ");
        // getConfigInfo();
        // System.out.println("### incrPartitionTo(2) >>> ");
        // incrPartitionTo(2);
        // System.out.println("### getTopicInfo() >>> ");
        // getTopicInfo();
        System.out.println("### demo() >>> ");
        demo();
    }
}