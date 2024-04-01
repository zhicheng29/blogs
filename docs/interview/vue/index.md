---
# 描述 默认取文章内容的前100个字符
description: Vue 常见问题

# 标签
tag:
  - Vue

# 取二三级标题生成目录
outline: [ 1, 2 ]
---

# Vue 常见问题

## Vue 响应式原理

### Vue2

```js

```

### Vue3

[链接: Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

利用 `Proxy` 代理,利用 `reflect` 反射

`Proxy` 是用于创建一个对象的代理,从而实现基本操作的拦截与自定义

:::warning
注意: `Proxy` 不是数据的双向绑定(数据双向绑定是指 `model` 和 `view` 层之间的关系)

`Proxy` 其实就是一个包装类,包装对象的一个方法,其实本质还是这个对象,只不过增加了一些功能而已
:::

**`get`** 方法: 用于拦截对象的读取操作

- `target`: 目标对象
- `property`: 被获取的属性名
- `receiver`: `Proxy` 或者继承 `Proxy` 的对象(最初被调用的对象)

```js
let original = {
    a: 1,
    b: 2,
}
let p = new Proxy(original, {
    get: function (target, property, receiver) {
        delete target.b
        console.log(target, property, receiver) // { a: 1 } a { a: 1 }
        return target.a
    },
})
console.log(p.a) // 1
console.log(p) // { a: 1 } 不会触发 get 函数
console.log(original) // { a: 1 }
```

**`set`** 方法: 用于拦截设置属性值的操作

- `target`: 目标对象
- `property`: 被获取的属性名
- `receiver`: `Proxy` 或者继承 `Proxy` 的对象(最初被调用的对象)

```js
const monster = {eyeCount: 4, earCount: 2}

const proxyObj = new Proxy(monster, {
    set(target, porterty, receiver) {
        if (porterty === 'eyeCount' && receiver % 2 !== 0) {
            console.log('Monsters must have an even number of eyes')
        } else {
            return Reflect.set(target, porterty, receiver)
        }
    },
})

// 并未重新设置 eyeCount 的值
proxyObj.eyeCount = 1 // Monsters must have an even number of eyes
console.log(monster) // { eyeCount: 4, earCount: 2 }
console.log(proxyObj.eyeCount) // 4

proxyObj.eyeCount = 6
console.log(monster) // { eyeCount: 6, earCount: 2 }
console.log(proxyObj.eyeCount) // 6
```

**`deletePorperty`** 方法: 用于拦截对象属性的 `delete` 操作

- `target`: 目标对象
- `porperty`: 待删除的属性名

```js
let p = new Proxy(
    {},
    {
        deleteProperty(target, porperty) {
            console.log(target, porperty)
            return true
        },
    }
)
delete p.a // {} a
```
