---
title: SpringCloud 基础知识
author: huoranger
date: 2022/10/02 21:29
categories:
 - 后端技术
tags:
 - Java
 - SpringCloud
 - 微服务
---
# SpringCloud 基础知识
## 认识微服务

### 单体架构

**单体架构**：将业务的所有功能集中在一个项目中开发，打成一个包部署。

![img](https://cdn.xn2001.com/img/2021/20210901083809.png!/format/webp)

**优点**：架构简单，部署成本低

**缺点**：耦合度高（维护困难、升级困难）

### 分布式架构

**分布式架构**：根据业务功能对系统做拆分，每个业务功能模块作为独立项目开发，称为一个服务。

![img](https://cdn.xn2001.com/img/2021/20210901092921.png!/format/webp)

**优点**：降低服务耦合，有利于服务升级和拓展

**缺点**：服务调用关系错综复杂

分布式架构虽然降低了服务耦合，但是服务拆分时也有很多问题需要思考：

- 服务拆分的粒度如何界定？
- 服务之间如何调用？
- 服务的调用关系如何管理？

### 微服务

微服务的架构特征：

- 单一职责：微服务拆分粒度更小，每一个服务都对应唯一的业务能力，做到单一职责
- 自治：团队独立、技术独立、数据独立，独立部署和交付
- 面向服务：服务提供统一标准的接口，与语言和技术无关
- 隔离性强：服务调用做好隔离、容错、降级，避免出现级联问题

![img](https://cdn.xn2001.com/img/2022/202205162352847.png!/format/webp)

微服务的上述特性**其实是在给分布式架构制定一个标准**，进一步降低服务之间的耦合度，提供服务的独立性和灵活性。做到高内聚，低耦合。

因此，**可以认为微服务是一种经过良好架构设计的分布式架构方案** 。其中在 Java 领域最引人注目的就是 SpringCloud 提供的方案了。

### SpringCloud

SpringCloud 是目前国内使用最广泛的微服务框架。官网地址：[https://spring.io/projects/spring-cloud](https://spring.io/projects/spring-cloud)。

SpringCloud 集成了各种微服务功能组件，并基于 SpringBoot 实现了这些组件的自动装配，从而提供了良好的开箱即用体验。

其中常见的组件包括：

![img](https://cdn.xn2001.com/img/2021/20210901083717.png!/format/webp)

另外，SpringCloud 底层是依赖于 SpringBoot 的，并且有版本的兼容关系，如下：

![img](https://cdn.xn2001.com/img/2021/20210901084050.png!/format/webp)

### 技术栈对比

![img](https://cdn.xn2001.com/img/2021/20210901090726.png!/format/webp)

## Eureka注册中心

最广为人知的注册中心就是 Eureka，其结构如下：

![img](https://cdn.xn2001.com/img/2021/20210901090919.png!/format/webp)

### 搭建注册中心

#### 搭建 eureka-server

引入 SpringCloud 为 eureka 提供的 starter 依赖，注意这里是用 **server**

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

#### 编写启动类

注意要添加一个 `@EnableEurekaServer` **注解**，开启 eureka 的**注册中心**功能

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class, args);
    }
}
```

#### 编写配置文件

编写一个 application.yaml 文件，内容如下：

```yaml
server:
  port: 10086
spring:
  application:
    name: eureka-server
eureka:
  client:
    service-url: 
      defaultZone: http://127.0.0.1:10086/eureka
```

其中 `default-zone` 是因为前面配置类开启了注册中心所需要配置的 eureka 的**地址信息**，因为 eureka 本身也是一个微服务，这里也要将自己注册进来，当后面 eureka **集群**时，这里就可以填写多个，使用 “,” 隔开。

启动完成后，访问 [http://localhost:10086/](http://localhost:10086/)

### 服务注册

引入 SpringCloud 为 eureka 提供的 starter 依赖，注意这里是用 **client**

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

在启动类上添加注解：`@EnableEurekaClient`

在 application.yaml 文件，添加下面的配置：

```yaml
spring:
  application:
      #name：orderservice
    name: userservice
eureka:
  client:
    service-url: 
      defaultZone: http:127.0.0.1:10086/eureka
```

### 服务拉取

首先给 `RestTemplate` 这个 Bean 添加一个 `@LoadBalanced` **注解**，用于开启**负载均衡**。

```java
@Bean
@LoadBalanced
public RestTemplate restTemplate(){
    return new RestTemplate();
}
```

访问服务

```java
String url = "http://服务名/user/" + order.getUserId();
User user = restTemplage.getForObject(url, User.class);
```

## Ribbon负载均衡

我们添加了 `@LoadBalanced` 注解，即可实现负载均衡功能，这是什么原理呢？

**SpringCloud 底层提供了一个名为 Ribbon 的组件，来实现负载均衡功能。**

![img](https://cdn.xn2001.com/img/2021/20210901091242.png!/format/webp)

### 源码跟踪

为什么我们只输入了 service 名称就可以访问了呢？为什么不需要获取 ip 和端口，这显然有人帮我们根据 service 名称，获取到了服务实例的ip和端口。它就是`LoadBalancerInterceptor`，这个类会在对 RestTemplate 的请求进行拦截，然后从 Eureka 根据服务 id 获取服务列表，随后利用负载均衡算法得到真实的服务地址信息，替换服务 id。

我们进行源码跟踪：

![img](https://cdn.xn2001.com/img/2021/20210901091323.png!/format/webp)

这里的 `intercept()` 方法，拦截了用户的 HttpRequest 请求，然后做了几件事：

- `request.getURI()`：获取请求uri，即 http://user-service/user/8
- `originalUri.getHost()`：获取uri路径的主机名，其实就是服务id `user-service`
- `this.loadBalancer.execute()`：处理服务id，和用户请求

这里的 `this.loadBalancer` 是 `LoadBalancerClient` 类型继续跟入 `execute()` 方法：

![img](https://cdn.xn2001.com/img/2021/20210901091330.png!/format/webp)

- `getLoadBalancer(serviceId)`：根据服务 id 获取 `ILoadBalancer`，而 `ILoadBalancer` 会拿着服务 id 去 eureka 中获取服务列表。
- `getServer(loadBalancer)`：利用内置的负载均衡算法，从服务列表中选择一个。在图中**可以看到获取了8082端口的服务**

可以看到获取服务时，通过一个 `getServer()` 方法来做负载均衡:

![img](https://cdn.xn2001.com/img/2021/20210901091345.png!/format/webp)

我们继续跟入：

![img](https://cdn.xn2001.com/img/2021/20210901091355.png!/format/webp)

继续跟踪源码 `chooseServer()` 方法，发现这么一段代码：

![img](https://cdn.xn2001.com/img/2021/20210901091414.png!/format/webp)

我们看看这个 `rule` 是谁：

![img](https://cdn.xn2001.com/img/2021/20210901091432.png!/format/webp)

这里的 rule 默认值是一个 `RoundRobinRule` ，看类的介绍：

![img](https://cdn.xn2001.com/img/2021/20210901091442.png!/format/webp)

> 负载均衡默认使用了轮训算法，当然我们也可以自定义。



### 流程总结

SpringCloud Ribbon 底层采用了一个拦截器，拦截了 RestTemplate 发出的请求，对地址做了修改。

基本流程如下：

- 拦截我们的 `RestTemplate` 请求 http://userservice/user/1
- `RibbonLoadBalancerClient` 会从请求url中获取服务名称，也就是 user-service
- `DynamicServerListLoadBalancer` 根据 user-service 到 eureka 拉取服务列表
- eureka 返回列表，localhost:8081、localhost:8082
- `IRule` 利用内置负载均衡规则，从列表中选择一个，例如 localhost:8081
- `RibbonLoadBalancerClient` 修改请求地址，用 localhost:8081 替代 userservice，得到 http://localhost:8081/user/1，发起真实请求

![img](https://cdn.xn2001.com/img/2021/20210901091755.png!/format/webp)

#### 负载均衡策略

负载均衡的规则都定义在 IRule 接口中，而 IRule 有很多不同的实现类：

![img](https://cdn.xn2001.com/img/2021/20210901091811.png!/format/webp)

不同规则的含义如下：

| **内置负载均衡规则类**    | **规则描述**                                                 |
| :------------------------ | :----------------------------------------------------------- |
| RoundRobinRule            | 简单轮询服务列表来选择服务器。它是Ribbon默认的负载均衡规则。 |
| AvailabilityFilteringRule | 对以下两种服务器进行忽略：（1）在默认情况下，这台服务器如果3次连接失败，这台服务器就会被设置为“短路”状态。短路状态将持续30秒，如果再次连接失败，短路的持续时间就会几何级地增加。 （2）并发数过高的服务器。如果一个服务器的并发连接数过高，配置了AvailabilityFilteringRule 规则的客户端也会将其忽略。并发连接数的上限，可以由客户端设置。 |
| WeightedResponseTimeRule  | 为每一个服务器赋予一个权重值。服务器响应时间越长，这个服务器的权重就越小。这个规则会随机选择服务器，这个权重值会影响服务器的选择。 |
| **ZoneAvoidanceRule**     | 以区域可用的服务器为基础进行服务器的选择。使用Zone对服务器进行分类，这个Zone可以理解为一个机房、一个机架等。而后再对Zone内的多个服务做轮询。 |
| BestAvailableRule         | 忽略那些短路的服务器，并选择并发数较低的服务器。             |
| RandomRule                | 随机选择一个可用的服务器。                                   |
| RetryRule                 | 重试机制的选择逻辑                                           |

默认的实现就是 `ZoneAvoidanceRule`，**是一种轮询方案**。

#### 自定义策略

通过定义 IRule 实现可以修改负载均衡规则，有两种方式：

1. 代码方式在 order-service 中的 OrderApplication 类中，定义一个新的 IRule

![img](https://cdn.xn2001.com/img/2021/20210901091832.png!/format/webp)

2. 配置文件方式：在 order-service 的 application.yaml 文件中，添加新的配置也可以修改规则：

```yaml
userservice: # 给需要调用的微服务配置负载均衡规则，orderservice服务去调用userservice服务
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule # 负载均衡规则 
```

> **注意**：一般用默认的负载均衡规则，不做修改。

#### 饥饿加载

当我们启动 orderservice，第一次访问时，时间消耗会大很多，这是因为 Ribbon 懒加载的机制。

![img](https://cdn.xn2001.com/img/2021/20210901091850.png!/format/webp)

Ribbon 默认是采用懒加载，即第一次访问时才会去创建 LoadBalanceClient，拉取集群地址，所以请求时间会很长。

而饥饿加载则会在项目启动时创建 LoadBalanceClient，降低第一次访问的耗时，通过下面配置开启饥饿加载：

```yaml
ribbon:
  eager-load:
    enabled: true
    clients: userservice # 项目启动时直接去拉取userservice的集群，多个用","隔开
```

## Nacos注册中心

SpringCloudAlibaba 推出了一个名为 Nacos 的注册中心，在国外也有大量的使用。

![img](https://cdn.xn2001.com/img/2021/20210901091857.png!/format/webp)

解压启动 Nacos，详细请看 [Nacos安装指南](https://www.xn2001.com/archives/661.html)

```shell
startup.cmd -m standalone
```

访问：[http://localhost:8848/nacos/](http://localhost:8848/nacos/)

### 服务注册

这里上来就直接服务注册，很多东西可能有疑惑，其实 Nacos 本身就是一个 SprintBoot 项目，这点你从启动的控制台打印就可以看出来，所以就不再需要去额外搭建一个像 Eureka 的注册中心。

#### 引入依赖

在 cloud-demo 父工程中引入 SpringCloudAlibaba 的依赖：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-alibaba-dependencies</artifactId>
    <version>2.2.6.RELEASE</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```

然后在 user-service 和 order-service 中的pom文件中引入 nacos-discovery 依赖：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

#### 配置nacos地址

在 user-service 和 order-service 的 application.yaml 中添加 nacos 地址：

```yaml
spring:
  cloud:
    nacos:
      server-addr: 127.0.0.1:8848
```

// TODO

## Feign远程调用

我们以前利用 RestTemplate 发起远程调用的代码：

![img](https://cdn.xn2001.com/img/2021/20210901092616.png!/format/webp)

- 代码可读性差，编程体验不统一
- 参数复杂URL难以维护

Feign 是一个声明式的 http 客户端，官方地址：[https://github.com/OpenFeign/feign](https://github.com/OpenFeign/feign)

其作用就是帮助我们**优雅的实现 http 请求的发送**，解决上面提到的问题。

### Feign使用

#### 引入依赖

我们在 order-service 引入 feign 依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

#### 添加注解

在 order-service 启动类添加 `@EnableFeignClient` 注解开启 Feign

#### 请求接口

在 order-service 中新建一个接口，内容如下

```java
@FeignClient("userservice")
public interface UserClient {
    @GetMapping("/user/{id}")
    User findById(@PathVariable("id") Long id);
}
```

* `@FeignClient("userservice")`：其中参数填写的是微服务名

* `@GetMapping("/user/{id}")`：其中参数填写的是请求路径

这个客户端主要是基于 SpringMVC 的注解 `@GetMapping` 来声明远程调用的信息，Feign 可以帮助我们发送 http 请求，无需自己使用 RestTemplate 来发送了。

```java
@Autowired
private UserClient userClient;

public Order queryOrderAndUserById(Long orderId) {
    // 1.查询订单
    Order order = orderMapper.findById(orderId);
    // TODO: 2021/8/20 使用feign远程调用
    User user = userClient.findById(order.getUserId());
    // 3. 将用户信息封装进订单
    order.setUser(user);
    // 4.返回
    return order;
}
```

// TODO

## Gateway网关

Spring Cloud Gateway 是 Spring Cloud 的一个全新项目，该项目是基于 Spring 5.0，Spring Boot 2.0 和 Project Reactor 等响应式编程和事件流技术开发的网关，它旨在为微服务架构提供一种简单有效的统一的 API 路由管理方式。

Gateway 网关是我们服务的守门神，**所有微服务的统一入口。**

网关的**核心功能特性**：

- 请求路由
- 权限控制
- 限流

![img](https://cdn.xn2001.com/img/2021/20210901092857.png!/format/webp)

* **权限控制**：网关作为微服务入口，需要校验用户是是否有请求资格，如果没有则进行拦截。
* **路由和负载均衡**：一切请求都必须先经过 gateway，但网关不处理业务，而是根据某种规则，把请求转发到某个微服务，这个过程叫做路由。当然路由的目标服务有多个时，还需要做负载均衡。
* **限流**：当请求流量过高时，在网关中按照下流的微服务能够接受的速度来放行请求，避免服务压力过大。

在 SpringCloud 中网关的实现包括两种：

- gateway
- zuul

Zuul 是基于 Servlet 实现，属于阻塞式编程。而 Spring Cloud Gateway 则是基于 Spring5 中提供的WebFlux，属于响应式编程的实现，具备更好的性能。

### 入门使用

1. 创建 SpringBoot 工程 gateway，引入网关依赖
2. 编写启动类
3. 编写基础配置和路由规则
4. 启动网关服务进行测试

```xml
<!--网关-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
<!--nacos服务发现依赖-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

application.yaml 文件

```yaml
server:
  port: 10010 # 网关端口
spring:
  application:
    name: gateway # 服务名称
  cloud:
    nacos:
      server-addr: localhost:8848 # nacos地址
    gateway:
      routes: # 网关路由配置
        - id: user-service # 路由id，自定义，只要唯一即可
          # uri: http://127.0.0.1:8081 # 路由的目标地址 http就是固定地址
          uri: lb://userservice # 路由的目标地址 lb就是负载均衡，后面跟服务名称
          predicates: # 路由断言，也就是判断请求是否符合路由规则的条件
            - Path=/user/** # 这个是按照路径匹配，只要以/user/开头就符合要求
```

我们将符合`Path` 规则的一切请求，都代理到 `uri`参数指定的地址。

上面的例子中，我们将 `/user/**` 开头的请求，代理到 `lb://userservice`，其中 lb 是负载均衡(LoadBalance)，根据服务名拉取服务列表，实现负载均衡。

重启网关，访问 [http://localhost:10010/user/1](http://localhost:10010/user/1) 时，符合 `/user/**` 规则，请求转发到 uri：http://userservice/user/1

![img](https://cdn.xn2001.com/img/2021/202108220127419.png!/format/webp)

路由配置包括：

1. 路由id：路由的唯一标示
2. 路由目标（uri）：路由的目标地址，http代表固定地址，lb代表根据服务名负载均衡
3. 路由断言（predicates）：判断路由的规则
4. 路由过滤器（filters）：对请求或响应做处理

> 多个 predicates 的话，要同时满足规则

// TODO
