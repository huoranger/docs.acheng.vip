---
title: RabbitMQ 六大模式
date: 2022-11-30 2:14:44
categories:
  - 中间件
tags:
  - RabbitMQ
---
# RabbitMQ 六大模式
**RabbitMQ 工具类**
```java
public class RabbitMQUtil {
    private static volatile ConnectionFactory connectionFactory = null;
    private static Connection connection = null;

    private RabbitMQUtil() {
    }

    /**
     * 从连接工厂中获取连接
     * @param host 主机
     * @param port 端口
     * @param virtualhost 虚拟主机
     * @param username 用户名
     * @param password 密码
     * @return 连接
     * @throws TimeoutException 超时
     */
    public static Connection getConnection(String host, int port, String virtualhost, String username, String password) throws TimeoutException {
        if (connectionFactory == null) {
            //同步锁，互斥使用
            synchronized (RabbitMQUtil.class) {
                if (connectionFactory == null) {
                    //创建连接MQ的连接工厂对象
                    connectionFactory = new ConnectionFactory();
                    //设置连接RabbitMQ的主机
                    connectionFactory.setHost(host);
                    //设置端口号
                    connectionFactory.setPort(port);
                    //设置连接哪个虚拟主机
                    connectionFactory.setVirtualHost(virtualhost);
                    //访问虚拟主机的用户名和密码
                    connectionFactory.setUsername(username);
                    connectionFactory.setPassword(password);
                    // 获取连接对象
                    try {
                        connection = connectionFactory.newConnection();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return connection;
    }

    public static void close(Connection connection, Channel channel) throws IOException, TimeoutException {
        if (channel != null) {
            channel.close();
        }
        if (connection != null) {
            connection.close();
        }
    }
}
```

## 简单模式
![图 6](../../../public/img/03-RabbitMQ%E5%85%AD%E5%A4%A7%E6%A8%A1%E5%BC%8F/IMG_20221130-115659219.png)  

简单模式,使用默认交换机(AMQP default)。功能：一个生产者P发送消息到队列Q,一个消费者C接收。

**生产者实现：**

## 工作队列模式
![图 7](../../../public/img/03-RabbitMQ%E5%85%AD%E5%A4%A7%E6%A8%A1%E5%BC%8F/IMG_20221130-121606230.png)  

工作队列模式(Work Queue),使用默认交换机(AMQP default)

功能：一个生产者，多个消费者，每个消费者获取到的消息唯一，多个消费者只有一个队列

任务队列：避免立即做一个资源密集型任务，不用必须等待它完成，而是把这个任务安排到稍后再做。我们将任务封装为消息并将其发送给任务队列。后台运行的工作进程将弹出任务并最终执行作业。当有多个 worker 同时运行时，任务将在它们之间共享。

::: tip 工作队列模式主要有两种模式：
1. 轮询模式的分发：一个消费者一条，按均分配；
2. 公平分发：根据消费者的消费能力进行公平分发，处理快的处理的多，处理慢的处理的少；按劳分配；
:::