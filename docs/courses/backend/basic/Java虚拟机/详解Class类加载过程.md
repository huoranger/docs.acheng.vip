---
title: 详解class加载过程
date: 2022-11-30 12:14:44
---

# 详解class加载过程

## 类加载过程
![图 19](../../../../public/img/02-%E8%AF%A6%E8%A7%A3Class%E7%B1%BB%E5%8A%A0%E8%BD%BD%E8%BF%87%E7%A8%8B/IMG_20221201-145245302.png)  

### 双亲委派
双亲委派是一个孩子向父亲方向，然后父亲向孩子方向的双亲委派过程。
![图 20](../../../../public/img/02-%E8%AF%A6%E8%A7%A3Class%E7%B1%BB%E5%8A%A0%E8%BD%BD%E8%BF%87%E7%A8%8B/IMG_20221201-145614104.png)  
详细过程
![图 21](../../../../public/img/02-%E8%AF%A6%E8%A7%A3Class%E7%B1%BB%E5%8A%A0%E8%BD%BD%E8%BF%87%E7%A8%8B/IMG_20221201-151907092.png)  
:::warning 提示
父加载器不是“类加载器的加载器”,也不是“类加载器”的父类(非继承)
:::

### 为什么需要双亲委派

### lazy loading
严格讲应该叫 lazy lnitializing。JVM规范并没有规定何时加载，但是严格规定了什么时候必须初始化:
* new getstatic putstatic invokestatic 指令，访问 final 变量除外
* `java.lang.reflect` 对类进行反射调用时
* 初始化子类的时候，父类首先初始化
* 虚拟机启动时，被执行的主类必须初始化
* 动态语言支持 `java.lang.invoke.MethodHandle` 解析的结果为 `REF_getstatic_REF putstatic_REF_invokestatic` 的方法句柄时,该类必须初始化