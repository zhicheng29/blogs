---
# 描述 默认取文章内容的前100个字符
description: JavaScript 问题

# 标签
tag:
    - JavaScript

date: 2023-09-02 20:21:00
# 取二三级标题生成目录
outline: [1, 2]
---

# JavaScript 常见问题

## 数据类型判断

**typeof**

`typeof` 只能判断出简单数据类型

```js
typeof 100; // "number"
typeof 'abc'; // "string"
typeof false; // "boolean"
typeof undefined; // "undefined"
typeof null; // "object"
typeof [1, 2, 3]; // "object"
typeof { a: 1, b: 2, c: 3 }; // "object"
typeof function () {}; // "function"
typeof new Date(); // "object"
typeof /^[a-zA-Z]{5,20}$/; // "object"
typeof new Error(); // "object"
typeof new Number(100); // "object"
typeof new String('abc'); // "object"
typeof new Boolean(true); // "object"
```

**instanceof**

`instanceof` 需要指定一个构造函数或者说是指定一个特定的类型,它用来判断这个构造函数的原型是否在给定对象的原型链上

```js
100 instanceof Number; // false
'' instanceof String; // false
false instanceof Boolean; // false
undefined instanceof Object; // false
null instanceof Object; // false
[1, 2, 3] instanceof Array; // true
({ a: 1, b: 2, c: 3 }) instanceof Object; // true
(function () {}) instanceof Function; // true
(() => {}) instanceof Function; // true
new Date() instanceof Date; // true
/^[a-zA-Z]{5,20}$/ instanceof RegExp; // true
new Error() instanceof Error; // true
```

:::warning
基本数据类型中：`Number`,`String`,`Boolean`.字面量值不可以用 `instanceof` 检测,但是构造函数创建的值可以

还需要注意 `null` 和 `undefined` 都返回了 `false`,这是因为它们的类型就是自己本身,并不是 `Object`
创建出来它们,所以返回了 `false`
:::

**constructor**

`constructor` 是 `prototype`
对象上的属性,指向构造函数,根据实例对象寻找属性的顺序,若实例对象上没有实例属性或方法时,就去原型链上寻找,因此实例对象也是可以使用 `constructor`
属性

```js
new Number(123).constructor; // [Function: Number]

let num = new Number(123);
num.constructor === Number; // true
```

```js
let num = 123;
let str = 'abcdef';
let bool = true;
let arr = [1, 2, 3, 4];
let json = { name: 'xxx', age: 25 };
let func = function () {};
let und = undefined;
let nul = null;
let date = new Date();
let reg = /^[a-zA-Z]{5,20}$/;
let error = new Error();

function Person() {}

let tom = new Person();

// null 和 undefined 没有 constructor
// 所有结果皆为 true
num.constructor === Number;
str.constructor === String;
bool.constructor === Boolean;
arr.constructor === Array;
json.constructor === Object;
func.constructor === Function;
date.constructor === Date;
reg.constructor === RegExp;
error.constructor === Error;
tom.constructor === Person;
```

**Object.prototype.toString()**

```js
let toString = Object.prototype.toString;

toString.bind(123)(); // "[object Number]"
toString.apply('abcdef'); // "[object String]"
toString.call(true); // "[object Boolean]"
toString.call([1, 2, 3, 4]); // "[object Array]"
toString.call({ name: 'xxx', age: 25 }); // "[object Object]"
toString.call(function () {}); // "[object Function]"
toString.call(undefined); // "[object Undefined]"
toString.call(null); // "[object Null]"
toString.call(new Date()); // "[object Date]"
toString.call(/^[a-zA-Z]{5,20}$/); // "[object RegExp]"
toString.call(new Error()); // "[object Error]"
```

## 检测对象为空对象

**Object.keys()**

```js
let obj = {};
Object.keys(obj).length ? true : false; // false
```

**JSON.stringify**

```js
let obj = {};
JSON.stringify(obj) === '{}' ? true : false;
```

**for in**

```js
function isEmpty(obj) {
	// 如果 obj 有 key 就会返回 false 说明不是空
	for (let key in obj) {
		return false;
	}
	return true;
}
```

## 类数组转换为数组

> **类数组**其实就是像 `arguments` 这样的 数组对象,可以**通过索引属性访问元素**并且**拥有**`length`对象

-   拓展运算符
-   Array.form()
-   Array.apply()
-   Array.prototype.slice.call()
-

```js
function foo(name, age, sex) {
	console.log(arguments); // [Arguments] { '0': 'symbol', '1': 18, '2': 'man' }
	// return [...arguments];
	// return Array.from(arguments);
	// return Array.apply(null, arguments);
	// return Array.prototype.splice.call(arguments);
	return Array.prototype.concat.call([], ...arguments);
}

console.log(foo('symbol', 18, 'man')); // [ 'symbol', 18, 'man' ]
```

## 改变原数组的函数

> **`push`**
>
> 可以接受**一个或多个**参数,将参数追加到数组的**尾部**,**返回新数组的长度**,原数组改变
>
> **`pop`**
>
> 从数组**尾部删除一个元素**,**返回被删除的元素**,原数组改变
>
> **`unshift`**
>
> 可接受**一个或多个**参数,将参数添加到数组的**头部**,**返回新数组的长度**,原数组改变
>
> **`shift`**
>
> 从数组**头部删除一个元素**,**返回这个被删除的元素**,原数组改变
>
> **`splice`**
>
> 可不传参数或多个参数
>
> -   **无**参数,**返回空数组**,原数组**不变**;
> -   **一个**参数,该参数表示**索引位**,从该**索引位开始**截取,**直至数组结束**,**返回截取的数组**,原数组改变;
> -   **两个**参数,,**第一个**表示**索引位**,**第二个**参数表示**截取长度**,**返回截取的数组**,原数组改变
> -   **三个**或**更多**参数, **第三个及以后**的参数表示要**从截取位插入**的值,**返回截取的数组**,原数组改变
>
> **`reverse`**
>
> **不接受**参数,数组翻转,**返回翻转后的数组**,原数组改变
>
> **`sort`**
>
> 可以**无**参数或者接受**一个定义排序的函数**作为参数,数组排序,**返回排序后的数组**,改变原数组
>
> -   **无参数**, 根据元素的 `Unicode` 码进行排序
> -   **一个参数**,根据传入**函数的排序规则**进行排序

## 数组去重

```js
let arr = [1, 1, 'true', 'true', false, false, NaN, NaN, {}, {}, undefined];
```

`ES6` 中的 `set` 方法(无法去除 `Object`)

```js
function arr_unique(arr) {
	return [...new Set(arr)];
	// return  Array.from(new Set(arr));
}

console.log(arr_unique(arr)); // [ 1, 'true', false, NaN, {}, {}, undefined ]
```

`map` 数据结构去重(无法去除 `Object`)

```js
function arr_unique2(arr) {
	let map = new Map();
	let array = new Array(); // 数组用于返回结果
	for (let i = 0; i < arr.length; i++) {
		if (map.has(arr[i])) {
			// 如果有该key值
			map.set(arr[i], true);
		} else {
			map.set(arr[i], false); // 如果没有该key值
			array.push(arr[i]);
		}
	}
	return array;
}

console.log(arr_unique2(arr)); // [ 1, 'true', false, NaN, {}, {}, undefined ]
```

递归去重(无法去除 `NaN`及 `Object`)

```js
function arr_unique3(arr) {
	let array = [...arr];
	let len = array.length;
	// 排序后更加方便去重
	array.sort();

	function loop(index) {
		if (index >= 1) {
			if (array[index] === array[index - 1]) {
				array.splice(index, 1);
			}
			loop(index - 1); // 递归loop，然后数组去重
		}
	}

	loop(len - 1);
	return array;
}

console.log(arr_unique3(arr)); // [ 1, NaN, NaN, {}, {}, false, 'true', undefined ]
```

`forEach + includes`(无法去除 `Object`)

```js
function arr_unique4(arr) {
	let res = [];
	arr.forEach((val) => {
		if (!res.includes(val)) {
			res.push(val);
		}
	});
	return res;
}

console.log(arr_unique4(arr)); // [ 1, 'true', false, NaN, {}, {}, undefined ]
```

`hash+hasOwnProperty+JSON.stringify`

```js
function arr_unique9(arr) {
	let hash = {};
	return arr.filter((val) => {
		return hash.hasOwnProperty(typeof val + JSON.stringify(val))
			? false
			: (hash[typeof val + JSON.stringify(val)] = true);
	});
}

console.log(arr_unique9(arr)); // [ 1, 'true', false, NaN, {}, undefined ]
```

## 数组排序

**冒泡排序**

思路: 两两比较,将最大的数放在数组末尾(位置交换)

![冒泡排序](/js/sort.gif)

```js
function BubbleSort(arr) {
	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr.length; j++) {
			if (arr[j] > arr[j + 1]) {
				let ele = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = ele;
			}
		}
	}
	return arr;
}

let arr = [2, 11, 10, 5, 4, 13, 9, 7, 8, 1, 12, 3, 6, 15, 14];

console.log(BubbleSort(arr)); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
```

**插入排序(插队排序)**

思路:

-   从第一个元素开始,该元素可以认为已经被排序
-   取出下一个元素,在已经排序的元素序列中从后向前扫描
-   如果该元素(已排序)大于新元素,将该元素移到下一位置
-   重复步骤 3,直到找到已排序的元素小于或者等于新元素的位置
-   将新元素插入到该位置后
-   重复步骤 2~5

![插队排序](/js/sort2.gif)

```js
function InsertSort(arr) {
	let len = arr.length;
	let preIndex, current;
	for (let i = 1; i < len; i++) {
		preIndex = i - 1;
		current = arr[i];
		while (preIndex >= 0 && current < arr[preIndex]) {
			arr[preIndex + 1] = arr[preIndex];
			preIndex--;
		}
		arr[preIndex + 1] = current;
	}
	return arr;
}

let arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];

console.log(InsertSort(arr)); // [2, 3, 4, 5, 15, 19, 26, 27, 36, 38, 44, 46, 47, 48, 50]
```

**快速排序(快排)**

```js
function QuickSort(arr) {
	//如果数组长度小于等于1，没必要排序，直接返回
	if (arr.length <= 1) return arr;
	//pivot 基准索引，长度的一半
	let pivotIndex = Math.floor(arr.length / 2); //奇数项向下取整
	//找到基准，把基准项从原数组删除
	let pivot = arr.splice(pivotIndex, 1)[0];
	//定义左右数组
	let left = [];
	let right = [];
	//把比基准小的放left,大的放right
	arr.forEach((ele) => {
		if (ele < pivot) {
			left.push(ele);
		} else {
			right.push(ele);
		}
	});
	return QuickSort(left).concat([pivot], QuickSort(right));
}

let arr = [49, 38, 65, 97, 76, 13, 27, 49];

console.log(QuickSort(arr)); // [13, 27, 38, 49, 49, 65, 76, 97]
```

## 数组扁平化

实现思路:

-   对数组的每一项进行遍历
-   判断该项是否是数组
-   如果该项不是数组则将其直接放进新数组
-   是数组则回到步骤 1,继续迭代
-   当数组遍历完成,返回这个新数组

**递归处理**

```js
Array.prototype.flattenFunc = function () {
	let resultArr = [];
	let len = this.length;
	for (let i = 0; i < len; i++) {
		if (Array.isArray(this[i])) {
			// resultArr = [...resultArr, ...this[i].flattenFunc()]
			resultArr = resultArr.concat(this[i].flattenFunc());
		} else {
			resultArr.push(this[i]);
		}
	}
	return resultArr;
};

let arr = [1, 2, 3, [4, 5, [6, 7, 8, 11]]];

console.log(arr.flattenFunc()); // [(1, 2, 3, 4, 5, 6, 7, 8, 11)]
```

**`reduce`**

```js
Array.prototype.flattenFunc = function () {
	return this.reduce((pre, cur, index, arr) => {
		return Array.isArray(cur)
			? pre.concat(cur.flattenFunc())
			: pre.concat(cur);
	}, []);
};

let arr = [1, 2, 3, [4, 5, [6, 7, 8, 11]]];

console.log(arr.flattenFunc()); // [(1, 2, 3, 4, 5, 6, 7, 8, 11)]
```

**`flat`**

```js
let arr = [1, 2, 3, [4, 5, [6, 7, 8, 11]]];

console.log(arr.flat(Infinity)); // [(1, 2, 3, 4, 5, 6, 7, 8, 11)]
```

**`yield*`**

```js
function* iterTree(tree) {
	if (Array.isArray(tree)) {
		for (let i = 0; i < tree.length; i++) {
			yield* iterTree(tree[i]);
		}
	} else {
		yield tree;
	}
}

let arr = [1, 2, 3, [4, 5, [6, 7, 8, 11]]];
let list = [];
for (const x of iterTree(arr)) {
	console.log(x);
	list.push(x);
}

console.log(list); // [(1, 2, 3, 4, 5, 6, 7, 8, 11)]
```

## 检测出现最多的字符及次数(包含相同次数)

```js
function findStr(str) {
	try {
		if (!str.length || typeof str !== 'string')
			throw new Error('props error');
		let strArr = str.split('');
		let strObj = {};
		let maxArr = [];
		let maxNum = 0;
		strArr.forEach((item) => {
			if (strObj[item]) {
				strObj[item]++;
			} else {
				strObj[item] = 1;
			}
		});
		for (const key in strObj) {
			if (strObj[key] > maxNum) {
				maxArr = [key];
				maxNum = strObj[key];
			} else if (strObj[key] === maxNum) {
				maxArr.push(key);
			}
		}
		return { maxArr, maxNum };
	} catch (err) {
		console.log(err);
	}
}

let str = 'saudhuibh';
console.log(findStr(str)); // { maxArr: [ 'u', 'h' ], maxNum: 2 }
```

## 原型链

`prototype`

每一个函数都有一个 `prototype` 属性,被称为显示原型

`__proto__`

每一个实例对象都会有 `__proto__` 属性,其被称为隐式属性

`constructor`

每个 `prototype` 原型都有一个 `constructor` 属性,指向它关联的构造函数

```js
function Func(name) {
	console.log(this, '前this指向'); // Func {} 前this指向
	this.name = name;
	console.log(this, '后this指向'); // Func { name: 'xxx' } 后this指向
}

const func = new Func('xxx');

// 在这个例子中 Func 是构造函数, func 为实例对象
console.log(Object); // [Function: Object]
console.log(func); // Func { name: 'xxx' }
console.log(func.__proto__); // {} Func的原型对象
console.log(func.__proto__ === Func.prototype); // true
console.log(func.__proto__.constructor); // [Function: Func]
console.log(func.__proto__.constructor === Func); // true
console.log(Object.prototype.toString.call(func)); // [object Object]
```

原型对象(即 `Func.prototype`)的 `constructor` 指向构造函数(`Func`)本身

```js
console.log(func.__proto__.constructor === Func); // true
```

实例对象(即 `func`) 的 `__proto__` 和原型对象指向同一个地方

```js
console.log(func.__proto__ === Func.prototype); // true
```

## new 发生了什么

以上面为例子

1. 创建了一个全新的对象
2. 这个对象会被执行 `[[Prototype]]`（也就是`__proto__`）链接
3. 生成的新对象会绑定到函数调用的 `this`
4. 通过 new 创建的每个对象将最终被 `[[Prototype]]` 链接到这个函数的 `prototype` 对象上
5. 如果函数没有返回对象类型 `Object`(包含 `Functoin`, `Array`,`Date`,`RegExg`,`Error`),那么 `new` 表达式中的函数调用会自动返回这个新的对象

模拟实现 `new`

```js
// 最新实现方法
function _new(fn, ...arg) {
	const obj = Object.create(fn.prototype);
	const ret = fn.apply(obj, arg);
	return ret instanceof Object ? ret : obj;
}

/**
 * 模拟实现 new 操作符
 * @param  {Function} ctor [构造函数]
 * @return {Object|Function|Regex|Date|Error}      [返回结果]
 */
function newOperator(ctor) {
	if (typeof ctor !== 'function') {
		throw 'newOperator function the first param must be a function';
	}
	// ES6 new.target 是指向构造函数
	newOperator.target = ctor;
	// 1.创建一个全新的对象，
	// 2.并且执行[[Prototype]]链接
	// 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
	let newObj = Object.create(ctor.prototype);
	// ES5 arguments转成数组 当然也可以用ES6 [...arguments], Aarry.from(arguments);
	// 除去ctor构造函数的其余参数
	let argsArr = [].slice.call(arguments, 1);
	// 3.生成的新对象会绑定到函数调用的`this`。
	// 获取到ctor函数返回结果
	let ctorReturnResult = ctor.apply(newObj, argsArr);
	// 小结4 中这些类型中合并起来只有Object和Function两种类型 typeof null 也是'object'所以要不等于null，排除null
	let isObject =
		typeof ctorReturnResult === 'object' && ctorReturnResult !== null;
	let isFunction = typeof ctorReturnResult === 'function';
	if (isObject || isFunction) {
		return ctorReturnResult;
	}
	// 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象。
	return newObj;
}
```

## 深拷贝与浅拷贝

**浅拷贝**

**浅拷贝**对于**基本数据类型**来说拷贝的是**值**并且会**开辟一个新的地址**,对于**引用数据类型**来说拷贝的是**地址**

```js
let person = { name: 'xxx', meta: { song: '爱的供养' } };
let person2 = { ...person };
person2.name = 'ooo';
person2.meta.song = '啦啦啦';
console.log(person.name); // 'xxx'
console.log(person.meta.song); // '啦啦啦'
```

-   `Object.assign`: 将所有源对象的可枚举属性复制到目标对象中, 最后返回修改后的目标对象

-   展开运算符`...`: 可实现对象或数组的浅拷贝

手写浅拷贝

```js
/**
 * 思路
 * 1. 如果拷贝的是一个基本数据类型,直接返回该值
 * 2. 新建一个对象
 * 3. 循环对象的所有属性,并且拷贝属性值,如果是引用类型,则拷贝的是该属性的引用地址
 */

function clone(target) {
	// 基本数据类型直接返回
	if (typeof target !== 'object' || target === null) return target;

	// 创建新对象
	const cloneTarget = Array.isArray(target) ? [] : {};

	// 循环处理
	for (let key in target) {
		if (target.hasOwnProperty(key)) {
			cloneTarget[key] = target[key];
		}
	}
	return cloneTarget;
}
```

**深拷贝**

**深拷贝**创建一个新的对象/数组(**开辟一个新的地址**),将原对象的各项属性值(数组的所有元素)拷贝过来

`JSON.parse(JSON.stringfy())`: 拷贝一个对象,源对象与目标对象互不影响

```js
const obj = {
	name: 'symbol',
	age: 18,
	meta: {
		song: '理想',
	},
};
const obj2 = JSON.parse(JSON.stringify(obj));
obj2.meta.song = 'Unknown';
console.log(obj); // { name: 'Nothing', age: 18, meta: { song: '理想' } }
```

该方法具有局限性

-   `NaN` `Infinity` `-Infinity` 会被序列化为 `null`
-   `Nothing` `undefined` `function` 会被忽略(对应属性会丢失)
-   `Date` 将得到的是一个字符串
-   拷贝 `RegExp` `Error` 对象,得到的是空对象 `{}`

```js
const obj = {
	num1: NaN,
	num2: Infinity,
	num3: -Infinity,

	symbol: Symbol('xxx'),
	name: undefined,
	add: function () {},

	date: new Date(),

	reg: /a/gi,
	error: new Error('错误信息'),
};

console.log(JSON.parse(JSON.stringify(obj)));
// {
//   num1: null,
//   num2: null,
//   num3: null,
//   date: '2023-03-03T03:40:38.594Z',
//   reg: {},
//   error: {}
// }
```

-   多个属性如果复用同一个引用数据 `A` 时,拷贝的结果和原数据结构不一致

```js
const base = {
	name: '张三',
	age: 18,
};

const obj = {
	base,
	children: base,
};

const res = JSON.parse(JSON.stringify(obj));

// 原对象, obj.base obj.children 指向同一个对象
obj.base.name = '李四';
console.log(obj.base === obj.children); // true
console.log(obj.children.name); // 李四

// 拷贝后, res.base res.children 指向了不同对象, 拷贝了两个(数据结构被改了)
res.base.name = '李四';
console.log(res.base === res.children); // false
console.log(res.children.name); // 张三
```

-   循环引用对象中使用将会报错

```js
const base = {
	name: '张三',
	age: 18,
};
base.base = base;
// TypeError: Converting circular structure to JSON
const res = JSON.parse(JSON.stringify(base));
```

`structuredClone`: 是一个新的 `API` 可用于对数据进行深拷贝,同时还支持循环引用

```js
const base = {
	name: '张三',
	age: 18,
};

const obj = { base };

obj.obj = obj;

const res = structuredClone(obj);

// 注意: 使用 structuredClone 进行拷贝, 如果有个属性值是个函数, 方法会抛出错误
// DOMException [DataCloneError]: () => {} could not be cloned.
const res2 = structuredClone({
	add: () => {},
});
```

手写深拷贝

```js
function deepClone(source) {
	const cache = new WeakMap();

	function _deepClone(source) {
		// 如果 source 不为对象或者为 null 时 不进行拷贝
		if (typeof source !== 'object' || source === 'null') return source;
		if (source instanceof Date) return new Date(source);
		if (source instanceof RegExp) new RegExp(source);
		// 循环引用 无线递归问题
		if (cache.get(source)) return cache.get(source);
		const result = Array.isArray(source) ? [] : {};
		cache.set(source, result);
		for (let key in source) {
			if (source.hasOwnProperty(key)) {
				result[key] = _deepClone(source[key]);
			}
		}
		return result;
	}

	return _deepClone(source);
}
```

## js 继承

**原型链继承**

```js
function Person() {
	this.info = {
		age: '18',
		name: 'xxx',
	};
}

Person.prototype.getInfo = function () {
	console.log(this.info);
};

function Star() {}

Star.prototype = new Person();

let child = new Star();
child.info.gender = '男';
child.getInfo(); // { age: '18', name: 'xxx', gender: '男' }

let child2 = new Star();
child2.getInfo(); // { age: '18', name: 'xxx', gender: '男' }
```

优点:

1. 父类方法可以复用

缺点:

1. 原型链继承中父类的**引用属性**会被子类共享,更改一个子类的引用类型,其他子类约会受影响
2. 子类性实例不可给父类构造函数传参

**构造函数继承**

```js
function Person(age, name) {
	this.info = {
		age,
		name,
	};
}

Person.prototype.getInfo = function () {
	console.log(this.info);
};

function Star(age, name) {
	Person.call(this, age, name);
}

let child = new Star('18', 'xxx');
child.info.gender = '男';
// child.getInfo() // error
console.log(child.info); // { age: '18', name: 'xxx', gender: '男' }

let child2 = new Star();
// child2.getInfo() // error
console.log(child2.info); // { age: undefined, name: undefined }
```

优点:

1. 可以在子类构造函数中向父类传参数
2. 父类的引用属性不会被共享

缺点:

1. 子类不能访问父类原型上定义的方法

**组合继承**

即综合**构造函数**与**原型链继承**的优点

```js
function Person(age, name) {
	this.shcool = 'school';
	this.info = {
		age,
		name,
	};
}

Person.prototype.getInfo = function () {
	console.log(this.info);
};

function Star(age, name, gender) {
	// 关键
	Person.call(this, age, name);
	this.info.gender = gender;
}

// 关键
Star.prototype = new Person();

Star.prototype.getSchool = function () {
	console.log(this.shcool);
};

let child = new Star('18', 'xxx', '男');
child.shcool = 'man school';
child.getInfo(); // { age: '18', name: 'xxx', gender: '男' }
child.getSchool(); // man school

let child2 = new Star();
child2.getInfo(); // { age: undefined, name: undefined, gender: undefined }
child2.getSchool(); // school
```

**原型式继承**

对参数对象的一种浅拷贝

类似于 `ES5` 的 `Object.create()` 方法在只有第一个参数时，与这里的 `objectCopy()` 方法效果相同

```js
function ObjCopy(obj) {
	function Fun() {}

	Fun.prototype = obj;
	return new Fun();
}

let personObj = {
	name: 'xxx',
	age: 18,
	firends: ['jack', 'tom', 'rose'],
	getName: function () {
		console.log(this.name);
	},
};

let person = ObjCopy(personObj);
person.name = 'symbol';
person.age = 19;
person.firends.push('windy');
person.getName(); // symbol

let person2 = ObjCopy(personObj);
person2.name = 'symbol2';
person2.age = 20;
person2.getName(); // symbol2
console.log(person2.firends); // [ 'jack', 'tom', 'rose', 'windy' ]
```

优点:

1. 父类的方法可以复用

缺点:

1. 父类的引用会被子类所共享
2. 子类实例不能向父类传递参数

**寄生式继承**

使用原型式继承对一个目标进行浅拷贝,增强这个浅拷贝的能力

```js
function ObjCopy(obj) {
	function Fun() {}

	Fun.prototype = obj;
	return new Fun();
}

function createAnother(original) {
	let clone = ObjCopy(original);
	clone.getName = function () {
		console.log(this.name);
	};
	return clone;
}

let personObj = {
	name: 'xxx',
	age: 18,
	firends: ['jack', 'tom', 'rose'],
};

let person = createAnother(personObj);
person.firends.push('windy');
console.log(person.firends); // [ 'jack', 'tom', 'rose', 'windy' ]
person.getName(); // xxx

let person2 = createAnother(personObj);
console.log(person2.firends); // [ 'jack', 'tom', 'rose', 'windy' ]
```

**寄生式组合继承**

```js
function objectCopy(obj) {
	function Fun() {}

	Fun.prototype = obj;
	return new Fun();
}

function inheritPrototype(child, parent) {
	let prototype = objectCopy(parent.prototype); // 创建对象
	prototype.constructor = child; // 增强对象
	Child.prototype = prototype; // 赋值对象
}

function Parent(name) {
	this.name = name;
	this.friends = ['rose', 'lily', 'tom'];
}

Parent.prototype.getName = function () {
	console.log(this.name);
};

function Child(name, age) {
	Parent.call(this, name);
	this.age = age;
}

inheritPrototype(Child, Parent);
Child.prototype.getAge = function () {
	console.log(this.age);
};

let child1 = new Child('symbol', 18);
child1.getAge(); // 18
child1.getName(); // symbol
child1.friends.push('jack');
console.log(child1.friends); // ["rose", "lily", "tom", "jack"]

let child2 = new Child('symbol2', 19);
child2.getAge(); // 19
child2.getName(); // symbol2
console.log(child2.friends); // ["rose", "lily", "tom"]
```

优点:

1. 只调用一次父类的构造函数
2. 可以向父类传递参数
3. 父类方法可复用
4. 父类的引用属性不会被子类共享

## bind 与 call/apply 的区别是什么

-   都可以改变 `this` 指向
-   第一个参数为 `this` 的指向
-   `bind` 返回的是一个新的函数,需要调用后执行,`call` 和 `apply` 调用后会立即执行
-   `bind` 和 `call` 可以传递多个参数并且是一一传递的,而 `apply` 最多只能传递两个参数(第一个为 `this` 的指向,
    第二个为一个数组表示需要传递的参数)
