---
# 用于设置在首页展示的 精选文章，值越大展示越靠前
sticky: 999

# 用于设置在首页列表展示的文章，从 1 开始，值越小越靠前
top: 1

# 用于设置文章左侧展示的 推荐文章 顺序（越小越靠前），或者在推荐列表中隐藏掉不展示
recommend: 1

# 描述 默认取文章内容的前100个字符
description: Vue3 源码学习 响应式,解析器,渲染器原理

# 用于单独设置文章的作者信息
author: nothing

# 标签
tag:
    - Vue3

date: 2024-04-24 21:14:00
# 用于设置文章是否出现在首页的列表里
hidden: false
# 单独设置是否展示文章的预计阅读时间
readingTime: false
# 取二三级标题生成目录
outline: [2, 3]
---

# Vue3 源码

> 三大核心
>
> 1. 响应式
> 2. 渲染器
> 3. 解析器

### 解析器

**编译**

> 在 nodejs 中运行

sfc = 单文件组件(.vue 文件)

-   compiler-core 核心编译
-   compiler-dom 编译浏览器平台, 依赖 compiler-core
-   compiler-sfc 编译单文件组件转换成 js 文件, 依赖 compiler-core 与 compiler-dom
    ast => transform => generate => 生成 render 函数(运行时执行)
-   compiler-ssr 编译服务端渲染, 依赖 compiler-dom

**运行**

> 在浏览器运行

-   runtime-core 生命周期, diff 算法 deng
-   runtime-dom 浏览器运行,dom api、属性、事件处理

### 响应式(Proxy)

**为什么要换成 object.defienProperty**

1. 数组的 API 无法拦截
2. 不能拦截对象新增的属性
3. 不能拦截通过 leng 改变的数组
4. 数字性能问题($set)

**vue2 $set 原理**

1. 先判断是不是响应式对象, `__observer__` 直接返回
2. 判断是不是对象,如果是对象通过 key[value] 修改值,如果是新的属性就使用 ReactivedefindProperty 把新增的属性添加上去变成响应式的
3. 判断是不是数组 是调用 splice 方法修改值
4. dep.notify() 通知试图更新

**Proxy**

1. 拦截对象属性的读取、设置、删除、函数调用、has()、ownKeys()、apply()、get()、set()等操作,拥有 13 个 api
2. Proxy 对应的是 Reflect(全局对象) ,它们拥有相同的方法

> 为什么 Vue3 中 Proxy 要和 effect 配合一起使用

1. Vue3 中代理对象的 set 更新依赖的时候需要一个布尔返回值,Reflect.set 返回的是 也是一个布尔值
2. 代理对象和 Reflect 对象可以相互调用

#### effect 副作用函数

> 什么是 effect 副作用函数以及作用,纯函数的区别?

1. 副作用函数式外部修改内部会影响内部(类似与闭包),作用是绑定 dom 和数据,通知页面及数据的更新(连接作用)
2. 纯函数外部修改了内部不会受影响

> 注意 Vue3 中响应式的数据格式

![](/vue3/dataFormat.png)

**Vue3 中的副作用函数具体做了哪些事情**

1. 收集更新视图函数

```js
let activeEffect;
export const effect = (fn: Function) => {
	const _effect = () => {
		activeEffect = _effect;
		fn();
	};
	_effect();
};
```

2. 创建依赖容器

```js
let targetMap = new WeakMap();
```

> 什么是 WeakMap
>
> 1. WeakMap 中的 key 只能是对象,不能是基本数据类型
> 2. WeakMap 中的 key 对象是弱引用
> 3. WeakMap 不能遍历

3. 收集依赖

在 Proxy 的 get 拦截函数中收集依赖,

```js
export const tracker = (target, key) => {
	let depsMap = targetMap.get(target);
	// 因为第一次没有值,需要给定一个默认值
	// 第一层
	if (!depsMap) {
		depsMap = new Map();
		targetMap.set(target, depsMap);
	}
	// 第二层
	let deps = depsMap.get(key);
	if (!deps) {
		deps = new Set();
		depsMap.set(key, deps);
	}
};
deps.add(activeEffect);
```

4. 更新依赖

```js
export const trigger = (target, key) => {
	let depsMap = targetMap.get(target);
	let deps: Set<any> = depsMap.get(key);
	deps.forEach((effect) => {
		effect();
	});
};
```

![](/vue3/effect.png)

#### reactive 原理

```js
export const reactive = <T extends object>(value: T) => {
	return new Proxy(value, {
		// 收集依赖
		get(target, key, receiver) {
			let res = Reflect.get(target, key, receiver);
      // effect
			tracker(target, key);
			return res;
		},
		// receiver 对象自身,保证 proxy 嵌套 函数嵌套
		// 更新依赖
		set(target, key, newValue, receiver) {
			let res = Reflect.set(target, key, newValue, receiver);
       // effect
			trigger(target, key);
			return res;
		},
	});
};
```

![](/vue3/reactive.png)

#### computed 原理

> computed 与 effect 是相似的,基本一样,只不过 computed 多了一个返回值

```js
// effect
let activeEffect;
export function effect(fn: Function) {
	const _effect = () => {
		activeEffect = _effect;
		const res = fn();
		// 将返回值返回 fn 为传入的函数
		return res;
	};
	_effect();
	return _effect;
}
```

```js
// computed
export const computed = (getter: Function) => {
	const _value = effect(getter);

  class ComputedRefImp{
    get value() {
      return _value();
  }
  return new ComputedRefImp();
};

// 1. 但是这样一进来就调用了
// 2. 值没变,会一直触发(无缓存)
```

```js
// computed
import { effect } from './effect';

export const computed = (getter: Function) => {
	let dirty = true; // 缓存 只有只依赖改变才会重新发生计算
	let value;
	const options = {
		lazy: true, // 初次不调用
		scheduler: () => {
			dirty = true;
		},
	};
	const _value = effect(getter, options);

	class ComputedRefImp {
		get value() {
			if (dirty) {
				value = _value();
				dirty = false;
			}
			return value;
		}
	}
	return new ComputedRefImp();
};
```

```js
// effect

interface Options{
  lazy: boolean
  scheduler: () => void
}

let activeEffect;
export function effect(fn: Function, options?: Options) {
	const _effect = () => {
		activeEffect = _effect;
		const res = fn();
		// 将返回值返回 fn 为传入的函数
		return res;
	};
	_effect.options = options; // trigger 的时候需要用
	if (!options?.lazy) {
		_effect();
	}
	return _effect;
}
```

```js
// 更新依赖
export const trigger = (target, key) => {
 ...
	deps.forEach((effect) => {
		effect();
		if (effect?.options?.scheduler) {
			effect.options.scheduler();
		} else {
			effect();
		}
	});
};
```

![](/vue3/computed.png)

#### watch 原理

```js
import { effect } from './effect';

interface Options{
  immediate: boolean
  flush?: 'sync' | 'post' |'pre'
}

const traverse = (target,seen = new Set()) => {
  if(target === null || typeof target !== 'object'|| seen.has(target)) return;
  seen.add(target)
  for(let key in target){
    tarverse(target[key],seen)
  }
  return target
}

export const watch = (target: any, cb: Function, options?: Options) => {
  // 1. 格式化参数 => getter 函数 => effect
  let getter: Fucntion;
  if (typeof target === 'function') {
    getter = target;
  }else{
    // 需要打平
    getter = () => traverse(target);
  }
  // 返回值
  let newVal,oldVal
  const job = () => {
    cb(newVal,oldVal)
    oldVal = newVal
  }
  // 依赖发生变化的时候执行job
  const effectFn = effect(getter,{lazy: true, scheduler: job})
  // immediate
  if(options?.immediate){
    job()
  }else{
    oldVal = effectFn()
  }
};
```
