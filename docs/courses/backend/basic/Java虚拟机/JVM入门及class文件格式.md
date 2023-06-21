---
title: JVM入门及class文件格式
date: 2022-11-30 12:14:44
isOriginal: false
articleLink: https://mp.weixin.qq.com/s/_4MFrQSYOIGYRdDGOJPDKQ
---
# JVM入门及class文件格式

## Java从编码到执行
![图 10](../../../../public/img/01-JVM%E5%85%A5%E9%97%A8%E5%8F%8Aclass%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F/IMG_20221130-132335866.png)  
a

* 从跨平台的语言到跨语言的平台


![图 11](../../../../public/img/01-JVM%E5%85%A5%E9%97%A8%E5%8F%8Aclass%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F/IMG_20221130-132404126.png)  

* JVM 跟 Java 无关

![图 12](../../../../public/img/01-JVM%E5%85%A5%E9%97%A8%E5%8F%8Aclass%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F/IMG_20221130-132604192.png) 

* JVM 是一种规范
* 虚构出来的一台计算机: 字节码指令集（汇编语言）;内存管理: 栈、堆、方法区

  
## 常见的JVM实现
* Hotspot: Oracle官方
* Jrockit: 曾号称最快的 JVM，后来被 Oracle 收购，合并于 Hotspot
* J9 IBM
* Microsoft VM
* TaobaoVM: Hotspot 深度定制版
* LiquidVM: 直接针对硬件(**虚拟机本身就是操作系统**)
* azul zing: 最新垃圾回收的业界标杆

查看自己的 Java 是什么虚拟机:
```
java -version
```
![图 13](../../../../public/img/01-JVM%E5%85%A5%E9%97%A8%E5%8F%8Aclass%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F/IMG_20221130-133202257.png)  
`mixed mode`: 解释和编译共存

## JDK JRE和JVM
![图 15](../../../../public/img/01-JVM%E5%85%A5%E9%97%A8%E5%8F%8Aclass%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F/IMG_20221130-134229753.png)  

## Class File Format
* 二进制字节流
* 数据类型: u1 u2 u4 u8 和 _info(表类型): _info 的来源是 Hotspot 源码中的写法
* 查看 16 进制格式的 ClassFile: `Sublime` / `Notepad` / `IDEA插件: BinEd`
* 可以观察 ByteCode 的方法：javap / JBE: 可以直接修改 / JClassLib: IDEA的插件

```text
classFile {
  u4 magic;
  u2 minor_version;
  u2 major_version;
  u2 constant_pool_count;
  cp_info constant_pool[constant_pool_count - 1];
  u2
}
```


![图 16](../../../../public/img/01-JVM%E5%85%A5%E9%97%A8%E5%8F%8Aclass%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F/IMG_20221130-152937361.png)  
