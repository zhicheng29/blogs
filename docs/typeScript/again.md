---
# 描述 默认取文章内容的前100个字符
description: 进阶版

# 标签
tag:
  - TypeScript

date: 2023-12-27 20:52:00

outline: [2, 3]
---

# TypeScript 重学

![思维导图](/ts/tsAll.png)

## 原始类型

> 除了 `Obejct` 外,`JavaScript` 的内置原始类型有: `string` / `number` / `boolean`/ `null` / `undefined` / `bigint` / `symbol`

在 ts 中的类型注解

```ts
const perName: string = ''
const age: number = 1
const flag: Boolean = false
const nul: null = null
const undef: undefined = undefined
const bigintVal1: bigint = 9007199254740991n
const bigintVal2: bigint = BigInt(9007199254740991)
const symbolVal: symbol = Symbol('unique')

const obj: Object = { perName, age }
```

:::tip
null 和 undefined
在 js 中, **null** 表示**此处有值,但是是个空值**,**undefined**表示**此处没有值**
但是在 ts 中,这两者类型都是有**具体意义的类型**,它们作为类型时,表示有意义的具体类型值. 在没有开启`strictNullChecks`检查下,**会被作为其他类型的子类型**
:::

```ts
const val1: null = null
const val2: undefined = undefined

const val3: string = null
const val4: string = undefined
```

除此之外,在 `ts` 中还有一个特殊的类型 `void` ,它和 `js` 中的 `void` 是不一样的

```js
// javascript

// 在 js 中 void 操作符有两种写法,类似于 typeof
1. void expression
2. void(expression)

// void(expression)通常是写在'行内js'中的
<a href='javascript:void(0)'/>  // 或者填充<image>的 src 属性

// void 操作符或执行后面跟着的表达式并返回一个undefined,可以使用它来执行一个立即执行函数
void function fn(){
  // ...
}()

// void 操作符强制将后面的函数声明转化成了表达式
```

```ts
// typescript
// 在 ts 中原始标注类型中也有 void,但与 js 不同的是,这里的 void 用于描述一个内部没有 return 语句,或者没有显式 return 一个值的函数的返回值

function fun1() {}
function fun2() {
  return
}
// 缺少返回类型批注的“fun3”隐式具有“any”返回类型
function fun3() {
  return null
}
```

在这里, `fun1` 和 `fun2` 的返回值类型都会被隐式推导成 `void`,只有 `fun3` 显式返回了 `null` 其返回值类型才被推导成 `null` . 但是在实际的代码执行中, `fun1` 和 `fun2` 的返回值均是 `undefined`,虽然 `fun3` 的返回值会被推导成 `null`,但是仍可以使用 `void` 进行标注.**你可以理解为 `void` 表示一个空类型,而 `null` 和 `undefined` 都是一个具有意义的实际类型(在 `ts` 中)**.在 `strictNullChecks` 关闭的情况下,可以将 `undefined` / `null` 赋值给 `void`

```ts
const voidVal1: void = null
const voidVal2: void = undefined
```

## 数组类型标注

声明数组类型

```ts
// 字符串数组
const arr1: string[] = []
const arr2: Array<string> = []
```

元组

> 规定长度和类型的数组

元祖越界访问

```ts
// 普通数组可越界
const arr: string[] = ['1', '2', '3']
// undefined
cosnole.log(arr[5])

// 元祖不可越界
const arr2: [string, number, boolean] = ['1', 2, false]
// Error 长度为 "3" 的元组类型 "[string, string, string]" 在索引 "5" 处没有元素。
console.log(arr2[5])
```

## 字面量类型与联合类型

在声明一个接口结构时,以下的写法并不精确

```ts
interface ResData {
  code: number
  status: string
  data: any
}
```

在大多数情况下,这里的 `code` 与 `status` 会来自于一组确定值的集合,比如 `code` 可能是 10000/10001/50000, `status` 可能是 `'success'` / `'failure'`.而上面类型也只给出一个宽泛的类型 `number(string)`,此时我们并不能准确访问 `code` ,也不能获得精确的提示

使用字面量类型和联合类型,加以改造

```ts
interface ResData {
  code: 10000 | 10001 | 50000
  status: 'success' | 'failure'
  data: any
}

// 此时我们就能在访问时获得精确的类型推导了
console.log(res.status === 'failure')
```

### 字面量类型

在上述例子中, `'success'` 在 `ts` 中被称为 **字面量类型**,它代表比原始类型更精确的类型,同时也是原始类型的子类型

字面量类型主要包括:

- **字符串字面量类型**
- **数字字面量类型**
- **布尔字面量类型**
- **对象字面量类型**

它们可以直接作为类型标注

```ts
const str: 'lll' = 'lll'
const num: 1 = 1
const flag: true = true

// Error 不能将类型“"lll111"”分配给类型“"1111"”
const str2: '1111' = 'lll111'
const str3: string = 'xixxix'
const str4: string = 'hahah'
```

上面的代码中,我们可以看出原始类型的值可以包括任意的同类型的值,而字面量类型的要求的是**值与字面量类型一致**

### 联合类型

联合类型你可以理解为，它代表了一组类型的可用集合，只要最终赋值的类型属于联合类型的成员之一，就可以认为符合这个联合类型

```ts
// 函数类型需要使用 () 包裹
interface Tem {
  value: true | string | number | boolean | 1 | {} | (() => {})
}
```

#### 互斥属性

通过多个对象类型的联合,来实现互斥型,如果这属性有字段 A,那个就没有字段 B

```ts
// 互斥属性
interface TemResult {
  user:
    | {
        vip: true
        val: '超级会员'
      }
    | {
        vip: false
        res: '普通用户'
      }
}
let result: TemResult
if (result.user.vip) {
  // 类型“{ vip: true; val: "超级会员"; }”上不存在属性“res”
  console.log(result.user.res)
}
```

## 枚举

`ts` 中的枚举类似于 `js` 中常声明的 `constants` 文件

```js
export const PageUrl = {
  Home_Page_Url:'url'
  User_Page_Url:'url2'
  Login_Page_Url:'url3'
}
```

在 `ts` 中可以替换成枚举

```ts
enum PageUrl {
  Home_Page_Url = 'url',
  User_Page_Url = 'url2',
  Login_Page_Url = 'url3',
}

const Home = PageUrl.Home_Page_Url
```

相比于 `js` 中的对象声明,枚举拥有的优势是有更好的类型提示和拥有双向映射,以及这些常量被真正**约束在一个命名空间下**

如果没有声明枚举的值,默认使用数字枚举(从 `0` 开始,以 `1` 递增)

```ts
enum Item {
  One,
  Two,
  Three,
}
console.log(Item.One) // 0
```

如果某个成员指定了枚举值,未赋值成员任然会从 `0` 开始递增,之后的成员会以被定义的枚举成员开始递增

```ts
const returnNum = () => 100 + 499
enum Items {
  Foo = returnNum(),
  Bar = 599,
  Baz,
}
```

如果你使用了**延迟求值**,**那么没有使用延迟求值的枚举成员必须放在使用常量枚举值声明的成员之后(如上例),或者放在第一位**

```ts
enum ResultItme {
  One,
  Num = 7,
  Three,
  Four,
  Five = '啊哈哈',
  Six = 6,
  Seven,
}
console.log(ResultItme.One) // 0
console.log(ResultItme.Num) // 7
console.log(ResultItme[7]) // Seven 被覆盖
console.log(ResultItme.Three) // 8
console.log(ResultItme.Four) // 9
console.log(ResultItme.Five) // 啊哈哈
console.log(ResultItme.Six) // 6
console.log(ResultItme.Seven) // 7
```

```ts
// 编译结果
var ResultItme
;(function (ResultItme) {
  ResultItme[(ResultItme['One'] = 0)] = 'One'
  ResultItme[(ResultItme['Num'] = 7)] = 'Num'
  ResultItme[(ResultItme['Three'] = 8)] = 'Three'
  ResultItme[(ResultItme['Four'] = 9)] = 'Four'
  ResultItme['Five'] = '\u554A\u54C8\u54C8'
  ResultItme[(ResultItme['Six'] = 6)] = 'Six'
  ResultItme[(ResultItme['Seven'] = 7)] = 'Seven'
})(ResultItme || (ResultItme = {}))
```

:::tip
注意: 仅有值为**数字**的枚举成员才能进行**双向枚举**,**字符串**枚举成员仍然只能**单向映射**
:::

**常量枚举**
与枚举相似,只不过多了一个 `const`

```ts
const enum Items {
  One,
  Two,
  Three,
}
// Items is not defined
// console.log(Items['0'])
const newNum = Items.Num

// 编译结果
var newNum = 1 /* Items.Num */
```

它和普通枚举的差异主要在访问性与编译产物.对于常量枚举,你**只能通过枚举成员访问枚举值**(而不能通过值访问成员).同时,在编译产物中并不会存在一个额外的辅助对象(如 `Items` 对象)，对枚举成员的访问会被**直接内联替换为枚举的值**,可减少编译代码编译

## 函数

### 函数的类型签名

变量的类型是变量的值类型,那么函数的类型就是**函数的入参类型以及函数返回值类型**.它们使用 `:` 的语法进行类型标注

```ts
function fun(str: string): number {
  return str.length
}
```

在函数类型中同样存在类型推导,此处不声明返回值的类型,也能被推导出返回值的类型为`number`
上面这种方法称为**函数声明**,除此外还可以使用**函数表达式**来声明函数

```ts
// 不推荐使用,代码可读性差
const fun2: (str: string) => number = function (str) {
  return str.length
}
// 推荐使用
const fun3 = (str: string): number => {
  return str.length
}
```

使用 `type` / `interface` 定义函数类型

```ts
type FuncRes = (str: string) => number
// Callable Interface
interface FuncRuselt {
  (str: string): number
}
const fun2: FuncRes = function (str) {
  return str.length
}
const fun3: FuncRuselt = (str) => {
  return str.length
}
```

### void 类型

在 `ts` 中,一个函数没有返回值(没有 `return` 语句),其返回类型应当被标记为 `void` 而不是 `undefined`,但是其实它的实际值是 `undefined`

```ts
// 没有 return 语句
function func(): void {}
// 有 return 但是没有返回值
function func2(): void {
  return
}
```

**在 `ts` 中, `undefined` 类型是一个实际的,有意义的类型值,而 `void` 才代表空的,没有意义的值**.相比之下, `void` 更像是 `js` 中的 `null`.因此在没有 `return` 语句的函数中,才能更好的说明**没有执行返回操作**

```ts
// 所以在上面第二个函数中,最好的返回值是 undefined
function func2(): undefined {
  return
}
```

此时才能更准确的表达,这个函数**执行的返回操作,但是没有返回实际的值**

### 可选参数与 rest 参数

在很多时候,我们并不确定函数的某个参数是否一定会传递,此时可以像对象的可选属性一样,利用`?`表示一个可选参数,或者使用参数默认值

```ts
// 默认值
function func(name: string, age: number = 20): string {
  return `${name}今年${age}岁了`
}
// 可选属性
function func2(name: string, age?: number): string {
  return `${name}今年${age | 18}岁了`
}
// reset 参数
function fun3(name: string, ...rest: any[]) {}

func('王雷') // 王雷今年20岁了
func2('林雷') // 林雷今年18岁了
```

需要注意的是, **可选参数必须在必选参数后面**,函数的入参是按照顺序来排列的

### 重载

在某些逻辑比较复杂情况下,函数可能有多个入参类型和返回值类型

```ts
function func(num: number, flag?: boolean): string | number {
  if (flag) {
    return String(num)
  } else {
    return num++
  }
}
```

在这个例子中,函数的返回值是基于入参 `flag` 的值来决定的,当 `flag` 为 `true` 时,返回值为 `string` 类型,反之返回值为 `number` 类型,但是这里函数返回值并没有具体体现这一点(联合类型)

如果想获得准确的类型提示,可以使用 `ts` 提供的**函数重载签名**

```ts
// 放上面我们可以看到提示 (+1 overload),使用的是 Overload Signature
function func(num: number, flag: true): string
function func(num: number, flag: false): number
function func(num: number, flag?: boolean): string | number {
  if (flag) {
    return String(num)
  } else {
    return num++
  }
}

// 可以准确的得到类型提示
const result = func(2) // number
const resul2 = func(2, true) // string
const resul3 = func(2, false) // number
```

- `function func(num: number, flag: true): string`,重载签名一,传入 `flag` 值为 `true` 时,函数返回值为 `string` 类型
- `function func(num: number, flag?: false): number`,重载签名二,传入 `flag` 为 `false` 或者不传 `flag` 时,函数返回值为 `number` 类型
- `function func(num: number, flag?: boolean): string | number`, 函数的实现签名,会包含重载签名的所有情况

实际上, `ts` 中的重载更像是伪重载, **它只有一个具体体现,其重载体现在方法调用的签名上而非具体实现上**,而其他语言中,重载体现在多个**名称一致但入参不同的函数实现上**,这才是更广义的函数重载

## Class 类

### 类与类成员的类型签名

一个函数的主要结构是参数,逻辑和返回值,重点是对参数以及返回值的类型标注.而 `Class` 中其实也是一样的,它的主要结构只有**构造函数,属性,方法和访问符**
类型的标注类似于变量,而构造函数,方法,存取器的类型标注类似于函数

```ts
// 类声明
class Person {
  name: string
  constructor(personName: string) {
    this.name = personName
  }

  print(age: number): void {
    console.log(`${this.name}今年 ${age} 岁啦`)
  }

  get personA(): string {
    return `${this.name}A`
  }
  // setter 方法不允许进行返回值的类型标注
  set personA(val: string) {
    this.name = `${val}A`
  }
}

// 类表达式
const Person2 = class {
  name: string
  constructor(personName: string) {
    this.name = personName
  }
  print(age: number): void {
    console.log(`${this.name}今年 ${age} 岁啦`)
  }
  // ...
}
```

### 修饰符

在 `ts` 中我们可以为 `Class` 成员添加修饰符: `public(公共)` / `private(私有)` / `protected(受保护)` / `readonly(只读)`,除了 `readonly` 外,其他的三个属于访问性修饰符,而 `readonly` 属于操作性修饰符(就和 `interface` 中的 `readonly` 意义一致)

- `public` 在**类,类的实例,子类**中都能访问(默认值)
- `private` 只能在**类的内部**(自身)被访问
- `protected` 只能在**类和子类**中被访问(实例中不可访问)

```ts
class Fruits {
  name: string
  private num: number
  readonly unitPrice: number
  constructor(name: string, num: number, unitPrice: number) {
    this.name = name
    this.num = num
    this.unitPrice = unitPrice
  }
  protected totalPrice(): string {
    return `${this.num}个${this.name}总价为 ${this.num * this.unitPrice} 元`
  }
}
class Fruits2 extends Fruits {
  constructor(name: string, num: number, unitPrice: number) {
    super(name, num, unitPrice)
  }
  totalPrice2(): string {
    this.name = '榴莲'
    return this.totalPrice()
  }
}
const banana = new Fruits2('香蕉', 5, 1)
console.log(banana.totalPrice2()) // 5个榴莲总价为 5 元
```

## 内置类型 any unkonwn 与 never

### any

`any` 类型的参数可以接受任意类型的值(未标注类型,默认是 `any` 类型)

```ts
let anyVal: any
anyVal = '哈哈哈'
anyVal = 12
anyVal = false
```

标记为具体类型的变量也可以接受任何 `any` 类型的值

```ts
const boo: string = anyVal
const num: number = anyVal
```

而 `any` 类型的主要意义,其实就是为了表示一个 **无拘无束的 '任意类型' ,它能兼容所有类型,也能被所有类型兼容**.如果我们在项目中滥用 `any` 类型,那么 `TypeScript` 就变成了 `AnyScript` ,类型检查就变得无意义
:::tip

1. 如果类型不兼容使用了而使用了 `any` ,考虑用类型断言代替
2. 如果想要表达的是一个未知类型,更合理的方式是使用 `unknown`

:::

### unknown

`unknown` 类型和 `any` 类型有些相似, 一个 `unknown` 类型的变量可以被再次赋值为任意其他类型,但是自身只能赋值给 `any` 和 `unknown`类型

```ts
let unknownVal: unknown
unknownVal = '哈哈哈'
unknownVal = 12
unknownVal = false

const unknownVal2: unknown = unknownVal
const anyVal2: any = unknownVal
const str: string = unknownVal // error
const num: number = unknownVal // error
// ...
```

这里可以理解成 `any` / `unknown` > 原始类型,对象类型 > 字面量类型

### never

```ts
type neverType = number | boolean | void | never
```

当我们将鼠标放在 `neverType` 时,发现 `never` 类型消失了,但是 `void` 存在.`void` 类型是个空类型(这里有类型,但是个空类型)
而 `never` 才是一个**什么都没有**的类型,不包括空类型,即**不携带任何的类型信息**,因此会被联合类型抹除

```ts
let neverVal: never
let voidVal: void

neverVal = voidVal // error 不能将类型“void”分配给类型“never”
voidVal = neverVal
```

`never` 类型是**所有类型中最底层的类型**,和 `null`,`undefined`一样,它是所有类型的子类型,但是只有 `never` 类型的变量能够赋值给另一个 `never` 类型变量

```ts
function throwErrorFn(): never {
  throw new Error('never')
}
function func(): void {
  throwErrorFn() // 等同于 return
  console.log('无法输出') // 检测到无法访问的代码。
}
func()

// 启用 strictNullChecks 并且关闭 noImplicitAny 情况下

const arr = [] // 推导成 never[]
arr.push('xx') // error 类型“string”的参数不能赋给类型“never”的参数
```

## 类型断言

将一个变量的已有类型更改为新指定类型的操作,语法: `as newType`,在 `ts` 类型分析不正确或不符合预期时，将其断言为正确类型

```ts
// 将 any / unknown 类型断言至一个具体的类型,可跳过类型检查
let unknownVal: unknown
;(unknownVal as string).toString()
;(unknownVal as { func: () => {} }).func()

// 联合类型断言
function func(val: number | string) {
  if ((val as string).includes('2')) {
  }
  if ((val as number).toFixed() === '2') {
  }
}
```

## 双重断言

当原类型与断言类型之间差异过大时,需要双重断言

```ts
const str: string = 'xxx'
// 类型 "string" 到类型 "{ func: () => {}; }" 的转换可能是错误的，因为两种类型不能充分重叠。如果这是有意的，请先将表达式转换为 "unknown"
;(str as { func: () => {} }).func()

// 提示先转为一个通用的类型(any/unknown)
;(str as unknown as { func: () => {} }).func()
```

## 非空断言

告诉编译器此处一定有值,即 `!`语法

```ts
type objType = {
  name?: string
  age: number
}
let obj2: objType = {
  age: 18,
}
obj2.name.toString() // error “obj2.name”可能为“未定义”

obj2.name!.toString()
```

## 类型别名

类型别名主要作用是对一组类型或一个特定类型结构进行封装,以便于在其他地方进行复用

```ts
// 抽离接口状态码
type StatusCode = 200 | 201 | 301 | 400 | 404 | 500 | 502
// 抽离公共函数类型
type Handler = (e: Event) => void
// 对象类型
type ObjType = {
  name: string
  age: number
}
// 类型别名可以接受泛型,然后把它作为联合类型的一个成员,(工具类型)
type GenType<T> = T | number | string
let constant: GenType<boolean> = true // 拥有联合类型
constant = 'xxx'
constant = 1
// 但是一般不会直接使用工具类型你来作为标注类型,而是在它的基础上拓展一个新类型
type newGenType = GenType<boolean>
```

## 交叉类型

交叉类型和联合类型有点相似,只不过符号是 `&` ,即按位与运算符
与 `js` 中和 `||` 和 `&&` 相似,联合类型 `|` 表示或,交叉类型 `&` 表示且

```ts
interface NameStruct {
  name: string
}
interface AgeStrct {
  age: number
}
type Person = NameStruct & AgeStrct
// 这里的 boy 对象需要同时符合这两个类型(即类型的合并)
const boy: Person = {
  name: '男孩',
  age: 18,
}
```

```ts
type StrAndNum = number & string // never
```

原始类型的交叉,发现 `StrAndNum` 类型居然变成了 `never` 类型,这是因为没有一个类型可以符合既是字符串类型又是数字类型,所以才会出现 `never` 类型(**不存在的类型**),这也可以体现出 `never` 是 `BottomType`

对于对象类型的交叉类型,其内部的同名属性类型也会按照交叉类型进行合并

```ts
type Struct = {
  primitiveProp: string
  objectProp: {
    name: string
  }
}

type Struct2 = {
  primitiveProp: number
  objectProp: {
    age: number
  }
}

type Composed = Struct & Struct2

type PrimitivePropType = Composed['primitiveProp'] // never
type objectPropType = Composed['objectProp'] // { name: string; age: number}
```

总的来说,交叉类型就是两个类型取**交集**

## 索引类型

索引类型包括:**索引签名类型,索引类型查询,索引类型访问**
它们唯一的共同点: **通过索引的形式来进行类型操作**,但索引签名类型是声明,后两者是**读取**

### 索引签名类型

索引签名类型主要是指在接口或者类型别名中,通过以下语法来**快速声明一个键值类型一致的类型结构**

```ts
interface AllStringTypes {
  [key: string]: string
}
type PropType = AllStringTypes['哈哈哈'] // string
type PropType2 = AllStringTypes[666] // string
const foo: AllStringTypes = {
  6: 'xxx',
  www: 'www',
  [Symbol('xxx')]: 'xxx',
}
```

在 `js` 中, `obj[prop]` 形式的访问会将**数字索引访问转换为字符串索引的形式**

索引签名类型也可以与具体的键值对类型并存,但是具体的键值类型需要符合索引签名类型

```ts
interface AllStringTypes2 {
  // error 类型“boolean”的属性“propA”不能赋给“string”索引类型“string”。
  propA: boolean
  [key: string]: string
}

interface AllStringTypes2 {
  propA: boolean
  propB: number
  [key: string]: string | boolean | number
}
```

### 索引类型查询

索引查询类型,也就是 `keyof` 操作符,它可以将对象中的所有键转化为对应字面量类型,然后在组合联合类型.注意:**这里并不是将数字类型的键名转换为字符串类型字面量,而是仍然保持为数字类型字面量**

```ts
interface Foo {
  symbol: 2
  6: 666
}
type FooKeys = keyof Foo
// 或者
type FooKeys2 = keyof Foo & {} // 'symbol' | 6
```

这里的 `keyof` 相当于 `js` 中的 `Object.keys(obj).join('|)`

除此之外,可以使用 `keyof any` 来生产一个联合类型,它会由所有可用作对象键值的类型组成: `string` / `number` / `symbol`.总的来说, **`keyof` 的产物必定是一个联合属性**

### 索引类型访问

```ts
interface NameRecord {
  [key: string]: number
  propA: string
}
type PropsType = NameRecord[string] // number
interface Foo {
  propA: string
  propB: number
  propC: boolean
  str: 'xxx'
  boo: false
  num: 3
  obj: object
  fn: Function
}
type propAType = Foo['propA'] // string
type propBType = Foo['propB'] // number
type PropTypeUnion = Foo[keyof Foo] // string | number | boolean | object | Function
```

在上述例子中,可以看到索引类型的本质其实就是,**通过键的字面量类型访问这个键对应的键值类型**

## 映射类型

```ts
interface Foo {
  propA: string
  propB: number
  porpC: boolean
  propD: () => void
}
type Stringify<T> = {
  [K in keyof T]: string
}
type Stringify2<T> = {
  [K in keyof T]: T[K]
}
type StringifiedFoo = Stringify<Foo> // propA: string;propB: string;porpC: string;propD: string;
type StringifiedFoo2 = Stringify2<Foo> // propA: string;propB: number;porpC: boolean;propD: () => void;
```

这里的 `T[K]` 其实就是索引类型访问,使用字面量类型访问到了键值的类型,这里就相当于克隆一个接口.
其实只有 `K in` 属于映射类型的语法,`keyof T` 属于`keyof`操作符,`[K in keyof T]`属于索引签名类型,`T[K]`属于索引类型访问

## 类型查询操作符

与 `js` 类似,用于检查变量类型的 typeof,只不过在 `ts` 中用于类型查询,返回一个 `ts` 类型(包含字面量类型)

```ts
// * 类型标注

const str = 'symbol'
const obj = { name: 'symbol' }
const nullVal = null
const undefinedVal = undefined
const func = (val: string) => {
  return val.length > 10
}

type Str = typeof str // 'symbol'
type Obj = typeof obj // {name: string}
type Null = typeof nullVal // null
type Undefined = typeof undefinedVal // undefined
type Func = typeof func // (val: string) => boolean

// * 工具类型

// (val: string) => boolean
const func2: typeof func = (str: string) => {
  return str === 'symbol'
}

// ReturnType 会返回一个函数类型中返回值位置的类型
type FuncReturnType = ReturnType<typeof func> // boolean

// 不允许使用表达式
let isValid: typeof func('symbol')
```

绝大多数情况下, `typeof` 返回的类型就是当你把鼠标悬浮在变量名上出现的类型推导后的类型,并且的**最窄的推导程度(字面量类型的级别)**

在逻辑代码中使用的 `typeof` 一定会是 `js` 中的 `typeof`,而类型代码中的 `typeof`(如类型标注,类型别名等)中的一定是类型查询的 `typeof`, 同时,为了更好的避免这种情况,也就是隔离类型层和逻辑层,并且类型查询操作符后是不允许使用表达式的

## 类型守卫

`ts` 中提供了非常强大的类型推导能力,会随着你的代码逻辑不断尝试收窄类型,这一能力称之为`类型的控制流分析`(也可以理解为类型推导)
如下例

```ts
function foo(val: string | number) {
  if (typeof val === 'number') {
  }
  if (typeof val === 'string') {
  }
  // ...
}
```

只有遇到特定条件才会进入,从而将所有的类型信息收集完毕

```ts
declare const strOrNumOrBoo: string | number | boolean

if (typeof strOrNumOrBoo === 'string') {
  // 一定是字符串,拥有 string 的方法
  strOrNumOrBoo.charAt(1)
} else if (typeof strOrNumOrBoo === 'number') {
  // 一定是数字,拥有 number 的方法
  strOrNumOrBoo.toFixed()
} else if (typeof strOrNumOrBoo === 'boolean') {
  // 一定是布尔值
  strOrNumOrBoo === true
} else {
  // 如果走到这里那么程序就有问题,未知类型
  const typeCheck: never = strOrNumOrBoo
  throw new Error(`Unknown val type: ${typeCheck}`)
}
```

在这里,通过 `if` 条件中的表达式进行了类型保护,告知分析程序每个 `if` 语句代码中的变量会是何类型.我们从逻辑中进行类型的推导,在反过来让类型位逻辑保驾

```ts
function isString(val: unknown): boolean {
  return typeof val === 'string'
}

function foo(val: string | number) {
  if (isString(val)) {
    // 类型“string | number”上不存在属性“replace”。
    val.replace('symbol', 'symbol666')
  }
  if (typeof val === 'string') {
  }
  // ...
}
```

将 `if` 表达式的判断提取至外部函数,就无法收集到类型信息了.在 `ts` 中类型控制流分析无法跨函数上下文来进行类型的信息收集,为此 `ts` 引入了 **`is` 关键字**来显式的提供类型信息

```ts
function isString(val: unknown): val is string {
  return typeof val === 'string'
}
```

`isString` 函数称为类型守卫,在它的返回值当中,我们不再使用 `boolean` 作为类型标注

将 `val is string` 拆解

- `val` 函数的某个参数
- `is string`,即**`is 关键字 + 预期类型`**,如果这个函数返回值为`true`,那么 `is` 关键字前的这个入参的类型,就会被`类型守卫调用方后续的类型控制流所收集到`

注意:类型守卫函数中的并不会对判断逻辑和实际类型的关联进行检查

```ts
function isString(val: unknown): val is number {
  return typeof val === 'string'
}

function foo(val: string | number) {
  if (isString(val)) {
    // 类型“number”上不存在属性“replace”。
    val.replace('symbol', 'symbol666')
  }
  if (typeof val === 'string') {
  }
  // ...
}
```

**其实类型守卫类似于类型断言,但类型守卫更宽容些.你指定什么类型,它就是什么类型**,除此之外,除了使用简单的原始类型之外,还可以使用对象类型,联合类型等

```ts
export type Falsy = false | 0 | '' | null | undefined
export const isFalsy = (val: unknown): val is Falsy => !val

// 不包括不常用的 symbol 和 bigint
export type Primitive = string | number | boolean | undefined
export const isPrimitive = (val: unknown): val is Primitive =>
  ['string', 'number', 'boolean', 'undefined'].includes(typeof val)
```

## in 与 instanceof

在 `js` 中,`in` 已经存在,`key in object`可以判断 `key` 是否存在于 `object` 或其原型链上.在 `ts` 中可以用它来保护类型

```ts
interface Foo {
  foo: string
  fooOnly: boolean
  shared: number
}
interface Bar {
  bar: string
  barOnly: boolean
  shared: number
}
function handle(val: Foo | Bar) {
  if ('foo' in val) {
    console.log(val.fooOnly)
  } else {
    console.log(val.barOnly)
  }
}
handle({ foo: '1', fooOnly: false, shared: 1 }) // false
handle({ bar: '2', barOnly: true, shared: 2 }) // true
```

这个例子中,我们使用 `foo` 和 `bar` 来区分 `val` 联合类型,然后可在对应的分支代码中正确的访问到 `Foo` 和 `Bar` 独有的 `fooOnly` / `barOnly` ,但是不可使用 `shared` 两者都有的属性来区分,会导致无法判断

```ts
function handle(val: Foo | Bar) {
  if ('shared' in val) {
    // 类型“Foo | Bar”上不存在属性“fooOnly”。类型“Bar”上不存在属性“fooOnly”
    console.log(val.fooOnly)
  } else {
    // 类型“never”上不存在属性“barOnly”
    console.log(val.barOnly)
  }
}
```

因为 `foo` / `bar` 和 `fooOnly` / `barOnly` 是各个类型独有的属性,因此可以作为**可辨识属性**. `Foo` 和 `Bar` 又因为存在具有区分能力的辨识属性,可以称为**可辨识联合属性**

也可以支持共同属性字面量类型的差异

```ts
interface Foo {
  kind: 'foo'
  diffType: string
  fooOnly: boolean
  shared: number
}
interface Bar {
  kind: 'bar'
  diffType: number
  barOnly: boolean
  shared: number
}
function handle(val: Foo | Bar) {
  if (val.kind === 'foo') {
    val.fooOnly
  } else {
    val.barOnly
  }
}
function ensureArray(val: number | number[]): number[] {
  if (Array.isArray(val)) {
    return val
  } else {
    return [val]
  }
}
```

对于同名但不同类型的属性,我们需要使用字面量属性的区分,并不能简单的使用 `typeof`

```ts
function handle2(val: Foo | Bar) {
  // error 类型“Foo | Bar”上不存在属性“fooOnly”。类型“Bar”上不存在属性“fooOnly”
  // 因为类型都是 Foo | Bar,无法准确的区分类型
  if (typeof val.diffType === 'string') {
    val.fooOnly
  } else {
    val.barOnly
  }
}
```

除此之外, `js` 还提供了一个功能类似于 `typeof` 与 `in` 的操作符: `instanceof`,它判断的是原型级别的关系.比如 `foo instanceof Base` 会沿着 `foo` 的原型链查找 `Base.prototype` 是否存在.也可以看做这是判断 `foo` 是否是 `Base` 的实例,同样也可以用来进行类型保护

```ts
class FooBase {}
class BarBase {}

class Foo extends FooBase {
  fooOnly() {}
}
class Bar extends BarBase {
  barOnly() {}
}

function handle(val: Foo | Bar) {
  if (val instanceof FooBase) {
    val.fooOnly()
  } else {
    val.barOnly()
  }
}
```

## 类型断言守卫

除了使用 `is` 关键字的类型守卫以外,其实还存在 `asserts` 关键字的类型断言守卫

```ts
import assert from 'assert'
let name: any = 'symbol'
assert(typeof name === 'number')
name.toFixed()
```

在运行上面的代码的时候会抛出一个错误,因为 `assert` 接收到的表达式结果为 `false`.类似于类型守卫的场景:如果断言**不成立**,比如这里意味着值的类型不为 `number`,那么在断言下方的代码就执行不到.如果断言通过了,不管你最开始是什么类型,断言后的代码**一定是符合断言的类型**,比如这里就是 `number`

**但是断言守卫和类型守卫最大的不同点在于,在判断条件不通过时,断言守卫需要抛出一个错误,类型守卫只需要剔除掉预期的类型**.但实际情况断言守卫并不会始终都抛出错误,所以它的返回值类型并不能简单的使用 `never` 类型.

```ts
function assert(condition: any, msg: string): asserts condition {
  if (!condition) {
    throw new Error(msg)
  }
}
```

这里使用的是 `asserts condition` ,而 `condition` 来自于实际逻辑,意味着,我们**将`condition`这一逻辑层面的代码,作为了类型层面的判断依据**,这相当于返回值类型中使用了一个逻辑表达式进行类型标注

对于 `assert(typeof name === 'number')` 这个断言,如果函数返回成功,就说明后续的代码中 `condition` 成立,也就是 `name` 变成了一个 `number` 类型

这里的 `condition` 甚至还可以结合使用 `is` 关键字来提供进一步的类型守卫能力

```ts
let name: any = 'symbol'

function assertIsNumber(val: any): asserts val is number {
  if (typeof val !== 'number') {
    throw new Error('Not a number')
  }
}
assertIsNumber(name)
// number 类型,通过了这个 assertIsNumber 函数
name.toFixed()
```

## 泛型

泛型是什么?顾名思义,广泛的类型,泛型简单理解就是随场景而改变的类型

### 类型别名泛型

如果类型别名声明了一个泛型坑位,那其实就是等价于一个接受参数的函数

```ts
//  T 就是变量,返回值则是一个包含 T 的联合类型
type Factory<T> = T | string | number
```

类型别名中的泛型大多是用来进行工具类型封装的

```ts
type Stringfy<T> = {
  [K in keyof T]: string
}
type Clone<T> = {
  [K in keyof T]: T[K]
}

interface Foo {
  prop: string
  prop2: number
  prop3: boolean
  prop4: () => void
}
type Partial<T> = {
  [K in keyof T]?: T[K]
}
type CopyFoo = Partial<Foo>
// CopyFoo 类型相当于
interface CopyFoo {
  prop?: string
  prop2?: number
  prop3?: boolean
  prop4?: () => void
}

type IsEqual<T> = T extends true ? 1 : 2
type A = IsEqual<true> // 1
type B = IsEqual<false> // 2
type C = IsEqual<'symbol'> // 2
```

在条件类型参与的情况下,通常泛型会被作为条件类型中的判断条件(`T extends Condition` 或者 `Type extends T`)以及返回值(即 `:` 两端的值)

### 泛型约束与默认值

像函数一样可以声明一个参数的默认值一样,泛型同样拥有默认值的设定

```ts
type Factory<T = boolean> = T | number | string
// 可不传类型
const foo: Factory = false
```

也可以要传入的泛型类型必须符合某些条件,否则就拒绝进入后面的逻辑

```ts
function add(val: number, num: number): number {
  if (typeof val !== 'number' || typeof num !== 'number') {
    throw new Error('参数类型错误')
  }
  return val + num
}
```

在泛型中,我们可以使用 `extends` 关键字来约束传入的泛型参数必须符合要求.关于 `extedns`, `A extends B` 意味着 **`A` 是 `B` 的子类型**,也就是说 `A` 比 `B` 的类型更准确.或者更复杂

- 更准确,如**字面量类型对应原始类型的子类型**,即 `'symbol' extedns string` , `6 extends number` 成立,类似的,**联合类型的子集均为联合类型的子类型**
- 更复杂,如 `{name: string}` 是 `{}` 的子类型

```ts
type ResStatus<ReCode extends number> = ReCode extends 200 | 500 | 502
  ? 'success'
  : 'failure'

type Res1 = ResStatus<200> // 'success'
type Res2 = ResStatus<302> // "failure"

type Res3 = ResStatus<'200'> // 类型“string”不满足约束“number”
```

### 多泛型关联

可以同时传入多个泛型参数,还可以让这几个泛型参数之间存在联系

```ts
type Condition<Type, Condition, TruthResult, FalsyResult> =
  Type extends Condition ? TruthResult : FalsyResult

type Result = Condition<'symbol', string, 'pass', 'reject'> // 'pass'
type Result2 = Condition<'symbol', number, 'pass', 'reject'> // 'reject'
```

上例子中,**多泛型参数其实就像接受更多参数的函数,其内部的运行逻辑(类型操作)会更加抽象,表现在参数(泛型参数)需要进行更多的逻辑运算(类型操作)会更加复杂**

```ts
type ProcessInput<
  Val,
  SecondVal extends Val = Val,
  ThirdVal extends Val = SecondVal
> = number
```

多个泛型之间的依赖,其实指的是在后续泛型参数中,使用前面的泛型参数作为约束或默认值,在上例子中

- 类型接受 1-3 个泛型参数
- 第二,三个泛型参数类型需要是**首个泛型参数的子类型**
- 只传一个泛型参数的时候,其第二个泛型参数会被赋值为此参数,而第三个则会赋值为第二个泛型参数,相当于**均使用了第一个泛型参数**
- 当传入两个泛型参数是时,第三个泛型参数会**默认赋值为第二个泛型参数的值**

### 对象类型中的泛型

```ts
interface Response<TData = unknown> {
  code: number
  msg: string
  data: TData
}
interface UserMsg {
  name: string
  age: number
  avatar: string
}
function fetchUserProfile(): Promise<Response<UserMsg>> {
  return new Promise((resolve, reject) => {})
}
type StatusSuccessed = boolean
function handle(): Promise<Response<StatusSuccessed>> {
  return new Promise((resolve, reject) => {})
}
```

接口定义中预留了 `data` 的泛型坑位

也可以支持多层嵌套

```ts
interface PaginationRes<ListType = unknown> {
  list: ListType[]
  page: number
  total: number
  hasNextPage: boolean
}
function fetchUserProfileList(): Promise<Response<PaginationRes<UserMsg>>> {
  return new Promise((resolve, reject) => {})
}
```

### 函数的泛型

假如有一个函数,无法确定它的类型,对于不同的类型做不同的操作

- 使用 `any` (不推荐)
- 联合类型(类型过多过于冗余)
- 泛型

```ts
function handle(val: string | number | {}): string | number | {} {
  return val
}

const shouldBeString = handle('symbol')
const shouldBeNumber = handle(666)
const shouldBeObject = handle({ name: 'symbol' })
```

虽然限制了函数参数的类型,但返回值的类型并没有像我们预期的一样与入参关联,返回值类型依旧是 `string | number | {}`,虽然可以使用重载声明可能得关联关系,但是太繁琐

```ts
function handle(val: string): string
function handle(val: number): number
function handle(val: {}): {}
function handle(val: string | number | {}): string | number | {} {
  return val
}
const shouldBeString = handle('symbol') // string
const shouldBeNumber = handle(666) // number
const shouldBeObject = handle({ name: 'symbol' }) // {}
```

```ts
function handle<T>(val: T): T {
  return val
}
const shouldBeString = handle('symbol') // 'string'
const shouldBeNumber = handle(666) // 666
const shouldBeObject = handle({ name: 'symbol' }) // {name: string}
```

声明一个泛型参数 `T`,并将参数的类型和返回值类型指向这个泛型参数,这样在这个函数接收到的参数时,**`T` 会自动被填充为这个参数的类型**,而在返回值的参数类型关联的情况下,也可以通过这个泛型参数来进行运算

在基于参数类型进行填充泛型时,其类型信息会被推断到尽可能精确的程度,如这里会**推导到字面量类型而不是基础类型**.这是因为在直接传入一个值时,这个值是不会再被修改的,因此可以推导到最精确的程度.而如果你使用一个变量作为参数,那么只会使用这个变量标注的类型(在没有标注时，会使用推导出的类型)

```ts
function swap<T, K>([start, end]: [T, K]): [K, T] {
  return [end, start]
}

const swapVal = swap(['symbol', 666])
const swapVal2 = swap([true, 666])
const swapVal3 = swap([{ name: 'symbol' }, 666])
```

函数中的泛型同样存在泛型约束和默认值

```ts
// 只接受 string 和 number 的参数
function handle<T extends string | number>(val: T): T {
  return val
}

// 只处理元组
function swap<T extends number, U extends number>([start, end]: [T, U]): [
  U,
  T
] {
  return [end, start]
}
```

:::warning
在 `tsx` 文件中泛型的尖括号可能会造成报错,编译器无法识别这是一个组件还是一个泛型,所系需要将
写得更像泛型

```tsx
const handle = <T extends any>(val: T): T => {
  return val
}
// 或者
const handle = <T,>(val: T): T => {}
```

:::

### Class 中的泛型

`class` 中的泛型和函数的泛型非常相似,只不过**函数中的泛型参数的消费方是参数和返回值类型**,**`class` 中的泛型消费方则是属性,方法,乃至装饰器等**.同时 `class` 内部的方法还可以在声明自己的独有的泛型参数

```ts
class Queue<TElementType> {
  private list: TElementType[]
  constructor(initVal: TElementType[]) {
    this.list = initVal
  }

  // 加入一个泛型子类型的元素
  addEle<TElType extends TElementType>(ele: TElType): TElementType[] {
    this.list.push(ele)
    return this.list
  }

  // 加入一个任意类型元素(无需为泛型子类型)
  addUnknownEle<TEltype>(ele: TEltype): (TElementType | TEltype)[] {
    return [...this.list, ele]
  }

  // 删除
  deleteEle(): TElementType[] {
    this.list.shift()
    return this.list
  }
}
```

### 内置方法的泛型

`ts` 中为非常多的内置对象都预留了泛型坑位,如 `Promise` 中

```ts
function pro() {
  return new Promise<boolean>((resolve, reject) => {
    resolve(false)
  })
}
```

当在填充 `Promise` 的泛型后,其内部的 `resolve` 方法也自动填充了泛型,而在 `ts` 内部的 `Promise` 类型声明中同样是通过泛型实现的

```ts
interface PromiseConstructor {
  // ...

  new <T>(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void
  ): Promise<T>

  // ...
}

declare var Promise: PromiseConstructor
```

还有数组 `Array<T>` 中,其泛型参数代表数组的元素类型

```ts
const arr: Array<number> = [1, 2, 3]
// 类型“string”的参数不能赋给类型“number”的参数。
arr.push('1')
// 类型“string”的参数不能赋给类型“number”的参数。
arr.includes('1')
// number | undefined
arr.find(() => false)

// reduce 第一种
arr.reduce((prev, curr, idx, arr) => {
  return prev
}, 1)

// reduce 第二种
// 不能将类型“number”分配给类型“never[]”。
arr.reduce((prev, curr, idx, arr) => {
  return [...prev, curr]
}, [])
```

`reduce` 方法是相对特殊的函数,它的类型声明存在几种不同的重载

- 当你不传入初始值时,泛型参数会从数组的元素类型中进行填充
- 当传入值时,如果初始值的类型与数组元素类型一致,则使用数组的元素类型进行填充
- 当传入一个数组类型的初始值,比如第二个 `reduce` 调用, `reduce` 的泛型参数会默认从这个初始值推导出的类型进行填充,如这里是 `never[]`

其中第二个 `reduce` 意味着**类型信息不足,无法推导出正确的类型**,我们可以手动传入泛型来解决

```ts
arr.reduce<number[]>((prev, curr, idx, arr) => {
  return [...prev, curr]
}, [])
```

## 结构化类型系统

```ts
class Cat {
  eat() {}
}
class Dog {
  eat() {}
}
function feedCat(cat: Cat) {}
feedCat(new Dog())
```

`feedCat` 函数接受的是个 `Cat`,为什么 `Dog` 也可以?

```ts
class Cat {
  eat() {}
  climbTree() {}
}
class Dog {
  eat() {}
}
function feedCat(cat: Cat) {}

// 类型“Dog”的参数不能赋给类型“Cat”的参数。类型 "Dog" 中缺少属性 "climbTree"，但类型 "Cat" 中需要该属性。
feedCat(new Dog())
```

如果给 `Cat` 类添加一个特有的方法,这个时候才能推导才是正确的.这是因为, `ts` 中比较两个类型并非通过类型的名称,而是比较这两个类型上实际拥有的属性和方法.也就是说,这里实际是比较 `Cat` 类型上的属性是否都存在于 `Dog` 类型上(也可以认为 `Cat` 类型中的所有方法和属性在 `Dog` 类型上都存在相同的,并且 `Dog` 上还可以存在额外的方法和属性 )

```ts
class Cat {
  eat(): boolean {
    return false
  }
}
class Dog {
  eat(): number {
    return 1
  }
}
function feedCat(cat: Cat) {}

// 类型“Dog”的参数不能赋给类型“Cat”的参数。在这些类型中，"eat()" 返回的类型不兼容。不能将类型“number”分配给类型“boolean”
feedCat(new Dog())
```

除了**基于类型结构进行兼容性判断的结构化类型系统**以外,还有一种**基于类型名进行兼容性判断的类型系统**,**标称类型系统**

## 标称类型系统

标称类型系统要求,两个可兼容的类型,**其名称必须是完全一致的**

```ts
type USD = number
type CNY = number

const CNYCount: CNY = 200
const USDCount: USD = 200

function add(cn: CNY, us: CNY) {
  return cn + us
}

add(CNYCount, USDCount)
```

在结构化类型系统中, `USD` 和 `CNY` 被认为是两个完全一致的类型,因此在 `add` 函数中可以传入 `USD` 类型的变量.但是这两个变量的实际意义并不一致

类型的重要意义之一是**限制数据的操作与实际意义**.比如,上面可以通过类型的结构,来让结构化类型系统认为两个类型具有父子类型关系,而对于标称类型系统,父子类型关系只能通过显示的集成来实现,称为**标称子类型**

```ts
class Cat {}

class ShorthairCat extends Cat {}
```

在 `ts` 中模拟**标称类型系统**
在 `ts` 中实现,其实我们只需要为类型额外附加元数据即可,比如 `CNY` 和 `USD` ,分别附上它们的单位信息即可,但是有需要保留原本的信息(原本的 `number` 类型)

```ts
declare class TagProtector<T extends string> {
  protected _tag_: T
}
type Nominal<T, U extends string> = T & TagProtector<U>

type CNY = Nominal<number, 'CNY'>
type USD = Nominal<number, 'USD'>

const CNYCount = 200 as CNY
const USDCount = 200 as USD

function add(cn: CNY, us: CNY) {
  return (cn + us) as CNY
}
// 不能将类型“"USD"”分配给类型“"CNY"”
add(CNYCount, USDCount)
```

这一实现方式本质上只在类型层面做了数据的处理,在运行时无法进行进一步的限制,可以从逻辑层面入手进一步确保安全性

```ts
class CNY {
  private _tag!: void
  constructor(public val: number) {}
}
class USD {
  private _tag!: void
  constructor(public val: number) {}
}

const CNYCount = new CNY(200)
const USDCount = new USD(200)

function add(cn: CNY, us: CNY) {
  return cn.val + us.val
}
add(CNYCount, CNYCount)

// 类型“USD”的参数不能赋给类型“CNY”的参数。 类型具有私有属性“_tag”的单独声明
add(CNYCount, USDCount)
```

通过这种方式,我们可以在运行时添加更多的逻辑,同时类型层面也得到了保障

这两种方式的本质都是通过额外属性实现了类型信息的附加,从而使得结构化类型系统将结构一致的两个类型也判断为不可兼容

## 判断类型兼容性的方式

### 原始类型判断

```ts
type res = 'symbol' extends string ? 1 : 2 // 1
type res2 = 1 extends number ? 1 : 2 // 1
type res3 = true extends boolean ? 1 : 2 // 1
type res4 = { name: string } extends object ? 1 : 2 // 1
type res5 = { name: 'symbol' } extends object ? 1 : 2 // 1
type res6 = [] extends object ? 1 : 2 // 1
```

结论: **字面量类型 < 对应的原始类型**

一个基础类型和它们对应的字面量类型必定存在父子类型关系,严格来说, `object` 出现在这里并不恰当,因为实际上代表着**所有非原始类型的类型,即数组,对象和函数类型**

### 联合类型判断

在联合类型中,只需要符合其中一个类型,就可以认为实现了这个联合类型

```ts
type res7 = 1 extends 1 | 2 | 3 | 4 | 5 ? 1 : 2 // 1
type res8 = 'symbol' extends 'symbol' | 'xxx' ? 1 : 2 // 1
type res9 = true extends true | false ? 1 : 2 // 1
```

结论: **字面量类型 < 包含此字面量类型的联合类型，原始类型 < 包含此原始类型的联合类型**

如果一个联合类型由同一个基础类型的类型字面量组成,那这个时候情况又有点不一样了,既然你的所有类型成员都是字符串字面量类型,那你就是 `string` 原始类型的子类型

```ts
type res10 = 'xxx' | 'symbol' extends string ? 1 : 2 // 1
type res11 = {} | (() => void) extends object ? 1 : 2 // 1
```

结论: **同一基础类型的字面量联合类型 < 此基础类型(原始类型)**

```ts
type res12 = 'symbol' extends 'symbol' | '666'
  ? 'symbol' | '666' extends string
    ? 1
    : 2
  : 3 // 1
```

最终结论: **字面量类型 < 包含此字面量类型的联合类型（同一基础类型） < 对应的原始类型**

### 装箱类型判断

`string` 类型是 `String` 类型的子类型, `String` 类型是 `Object` 类型的子类型.这是 `js` 在 `ts` 的体现,或者说是原型链的顶端是 `Object`对象与 `Object` 类型

```ts
type res13 = string extends String ? 1 : 2 // 1
type res14 = String extends {} ? 1 : 2 // 1
type res15 = {} extends object ? 1 : 2 // 1
type res16 = object extends Object ? 1 : 2 // 1
```

其中 `{}` 不是 `object` 的字面量类型吗?,这个时候,可以看做 `String` 继承了 `{}` 这个空对象,然后实现了自己的方法.**在结构化类型系统的比较下,`String`会被认为是`{}`的子类型**.这里`string < {} < object`看起来构建了一个类型链,但实际上`string extends object`并不成立

由于结构化类型系统这一特性的存在,可以得到一些看起来矛盾的结论

```ts
type res17 = {} extends object ? 1 : 2 // 1
type res18 = object extends {} ? 1 : 2 // 1

type res19 = object extends Object ? 1 : 2 // 1
type res20 = Object extends object ? 1 : 2 // 1

type res21 = Object extends {} ? 1 : 2 // 1
type res22 = {} extends Object ? 1 : 2 // 1
```

## Top Type

再往上,我们就达到了类型层级的顶端,这里只有 `any` 和 `unknown`. `any` 和 `unknown` 是 `ts` 中的 `Top Type` . `Object` 类型也是 `any` 和 `unknown` 类型的子类型

```ts
type res23 = Object extends any ? 1 : 2 // 1
type res24 = Object extends unknown ? 1 : 2 // 1

type res25 = any extends Object ? 1 : 2 // 1 | 2
type res26 = unknown extends Object ? 1 : 2 // 2
```

在 `ts` 内部代码的条件类型处理中,如果接受的判断是 `any` ,那么直接**返回条件类型结果组成的联合类型**

因此, `any extends string` 并不能简单的认为等价于一下条件类型.
在赋值给其他系统(类型)时, `any` 来者不拒,而 `unknown` 则只允许赋值给 `unknown` 和 `any` 类型,即 `any` 可以**表达为任何类型**
结论: **Object < any/unknown**

## Bottom Type

可以首先确定一个类型 `never` ,因为它代表的是'虚无'的类型(一个根本不存在的类型),对于这样的类型,它会是任何类型的子类型,也包括字面量类型

```ts
type res27 = never extends 'symbol' ? 1 : 2 // 1

type res28 = undefined extends 'symbol' ? 1 : 2 // 2
type res29 = null extends 'symbol' ? 1 : 2 // 2
type res30 = void extends 'symbol' ? 1 : 2 // 2
```

在 `ts` 中 `void` / `undefined` / `null` 都是**实际存在,并拥有实际意义的类型**

结论: **never < 字面量类型**

## 类型层级链

```ts
type VerboseTypeChain = never extends 'symbol' // never < '字面量类型'
  ? 'symbol' extends 'symbol' | 'xxx' // '字面量类型' < '拥有此字面量类型的联合类型'
    ? 'symbol' | 'xxx' extends string // 同一基础类型的字面量联合类型 < 此基础类型
      ? string extends {} // 原始类型 < object 和 Object 的字面量类型({} 可看作所有类型的基类)
        ? string extends String // 原始类型 < 原始类型的装箱类型
          ? String extends {} // 原始类型的装箱类型 < Object 类型
            ? {} extends object
              ? object extends {}
                ? {} extends Object
                  ? Object extends {}
                    ? object extends Object
                      ? Object extends object
                        ? Object extends any // Object < any / unknown
                          ? Object extends unknown
                            ? any extends unknown
                              ? unknown extends any
                                ? 8
                                : 7
                              : 6
                            : 5
                          : 4
                        : 3
                      : 2
                    : 1
                  : 0
                : -1
              : -2
            : -3
          : -4
        : -5
      : -6
    : -7
  : -8
// 8
```

其他场景

- 对于基类和派生类,通常情况下**派生类会完全保留基类的结构**,而只是自己新增的属性与方法.在结构化类型的比较下,其类型自然会存在子类型的关系.更不用说是派生类本身就是 `extends` 基类得到的
- 联合类型的类型层级比较,只需要比较各**联合类型是否可以被视为另一个联合类型的子集**,即**这个联合类型中所有成员在另一个联合类型中都能找到**

  ```ts
  type res31 = 1 | 2 | 3 extends 1 | 2 | 3 | 4 ? 1 : 2 // 1
  type res32 = 2 | 4 extends 1 | 2 | 3 | 4 ? 1 : 2 // 1
  type res33 = 1 | 2 | 5 extends 1 | 2 | 3 | 4 ? 1 : 2 // 2
  type res34 = 1 | 5 extends 1 | 2 | 3 | 4 ? 1 : 2 // 2
  ```

- 元组和数组

  ```ts
  type res35 = [number, number] extends number[] ? 1 : 2 // 1 元组中的所有元素类型为 number
  type res36 = [number, string] extends number[] ? 1 : 2 // 2 元组中的所有元素类型不全为 number
  type res37 = [number, string] extends (number | string)[] ? 1 : 2 // 1 联合类型,即成员是 number 或 string 类型即可
  type res38 = [] extends number[] ? 1 : 2 // 1 [] 成员未确定 相当于 never[]
  type res39 = [] extends unknown[] ? 1 : 2 // 1 同理
  type res40 = number[] extends (number | string)[] ? 1 : 2 // 1 联合类型
  type res41 = any[] extends number[] ? 1 : 2 // 1 any 可以为任何类型的子类型
  type res42 = unknown[] extends number[] ? 1 : 2 // 2 unknown 只能为 any 和 unknown 的子类型
  type res43 = never[] extends number[] ? 1 : 2 // 1
  ```

`ts`中**基础类型层级**关系

| 级别               | 类型                          |
| ------------------ | ----------------------------- |
| Top Type           | any / unknown                 |
| 顶级原型           | Object                        |
| 装箱类型           | String / Number / Boolean ... |
| 基础类型(拆箱类型) | string / number / boolean ... |
| 字面量类型         | 'xxx' / 666 / false ...       |
| Bottom Type        | never                         |

## 条件类型

条件类型的语法类似于我们平时常用的三元表达式

```ts
// 伪代码
ValA === ValB ? Res : Res
typeA entends typeB ? Res : Res
```

但是需要注意的是,条件类型中使用 `extends` 判断类型的兼容性,而非判断类型的全等型.因为在类型层面中,对于能够进行赋值操作的两个变量,我们**并不需要它们的类型完全相等,只需要具有兼容性**,而两个完全相同的类型,其 `extends` 自然也是成立的

条件类型与泛型一起使用

```ts
type ListeralType<T> = T extends string ? 'string' : 'other'

type Res = ListeralType<'symbol'> // 'string'
type Res2 = ListeralType<false> // 'other'

// 多层嵌套
type ListeralType2<T> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : T extends boolean
  ? 'boolean'
  : T extends null
  ? 'null'
  : T extends undefined
  ? 'undefined'
  : never

type Res = ListeralType2<'symbol'> // "string"
type Res2 = ListeralType2<1> // "number"
type Res3 = ListeralType2<false> // "boolean"
type Res4 = ListeralType2<null> // "null"
type Res5 = ListeralType2<undefined> // "undefined"
type Res6 = ListeralType2<never> // "never"
```

函数中条件类型与泛型搭配

```ts
function universalAdd<T extends number | string | boolean>(x: T, y: T) {
  return x + (y as any)
}
universalAdd(666, 1) // T 被填充为 666 | 1
universalAdd('symbol', '666') // T 被填充为 "symbol" | "666"
```

这个函数的返回值类型如何标注呢?**同一基础类型的字面量联合类型,其可以被认为是此基础类型的子类型**,即 `666 | 1` 是 `number` 的子类型

因此,我们可以使用嵌套类型的条件类型来进行字面量类型到基础类型的提取

```ts
function universalAdd<T extends number | string | bigint>(
  x: T,
  y: T
): LiteralToPrimitive<T> {
  return x + (y as any)
}

type LiteralToPrimitive<T> = T extends number
  ? number
  : T extends string
  ? string
  : T extends bigint
  ? bigint
  : never

universalAdd(666, 1) // number
universalAdd(10n, 10n) // bigint
universalAdd('symbol', '666') // string
```

条件类型还可以用来更复杂的类型进行比较,如函数类型

```ts
type Func = (...args: any[]) => any
type FunctionConditionType<T extends Func> = T extends (
  ...args: any[]
) => string
  ? 'string return func'
  : 'non-string return func'

// "string return func"
type StringRes = FunctionConditionType<() => string>
// 'non-string return func'
type NonStringRes = FunctionConditionType<() => boolean>
// 'non-string return func'
type NonStringRes2 = FunctionConditionType<() => number>
```

在这里,我们的条件类型用于判断两个函数类型是否具有兼容性,而条件中并不限制参数类型,仅比较两者的返回值类型

注意,存在泛型约束和条件类型的 `extends` 产生的作用时机完全不同,泛型约束要求你传入符合结构的类型参数,相当于**参数校验**,而条件类型的使用类型参数进行条件判断(相当于 `if else`),**实际内部逻辑**

### inter 关键字

在 `ts` 中可以通过 `infer` 关键字来**在条件类型中提取类型的某一部分信息**

```ts
type FunctionReturnType<T extends Func> = T extends (...args: any[]) => infer R
  ? R
  : never
```

当传入的类型参数满足 `T extends (...args: any[]) => infer R` 这样一个结构(不管 `infer R` , 当它是 `any` 就行)返回 `infer R` 位置的值,即 `R` 否则,返回 `never`

`infer` 是 `inference` 的缩写,意为推断,如 `infer R` 中 `R` 就表示**待推断的类型**.`infer` 只能在条件类型中使用,因为我们实际上仍然需要**类型结构是一致的**.比如上例中的类型信息需要是一个函数类型结构,我们才能提取它的返回值类型,如果连函数类型都不是,会返回 `never`

这里的**类型结构**当然那并不局限于函数类型结构,还可以是数组

```ts
type Swap<T extends any[]> = T extends [infer A, infer B] ? [B, A] : T

type SwapRes = Swap<[1, 2]> // 符合元组结构 ,元素替换 [2,1]
type SwapRes2 = Swap<[1, 2, 3]> // 不符合元组结构 不变化 [1,2,3]

// * 数组不定长时,可搭配 rest 操作符
// 提取首尾两个
type ExtracStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...any[],
  infer End
]
  ? [Start, End]
  : T
// 首尾替换
type SwapStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...infer Left,
  infer End
]
  ? [End, ...Left, Start]
  : T
// 调换开头两个
type SwapFirstTwo<T extends any[]> = T extends [
  infer Start,
  infer Start2,
  infer Left
]
  ? [Start2, Start, Left]
  : T
```

`infer` 也可以用作接口

```ts
// 提取对象的属性类型
type PropType<T, K extends keyof T> = T extends { [Key in K]: infer R }
  ? R
  : never

type PropTypeRes = PropType<{ name: string }, 'name'> // string
type PropTypeRes2 = PropType<{ name: string; age: number }, 'name' | 'age'> // string | number

// 反转键名与键值
type ReverseKeyValue<T extends Record<string, unknown>> = T extends Record<
  infer K,
  infer V
>
  ? Record<V & string, K>
  : never

type ReverseKeyValueRes = ReverseKeyValue<{ key: 'value' }> //{value: "key"}
```

也可以是 `Promise` 结构

```ts
type PromiseVal<T> = T extends Promise<infer V> ? V : T
type PromiseValRes = PromiseVal<Promise<number>> // number
type PromiseValRes2 = PromiseVal<number> // number 但未发生提取(T)
```

像条件类型可嵌套一样, `infer` 关键字也经常被使用在嵌套的场景中,包括对类型结构深层信息的提取,以及对提起到类型信息的筛选等

```ts
type PromiseValRes3 = PromiseVal<Promise<Promise<boolean>>> // Promise<boolean> 只提取了一层

// 按需提取
type PromiseVal2<T> = T extends Promise<infer V>
  ? V extends Promise<infer N>
    ? N
    : V
  : T

type PromiseValRes4 = PromiseVal2<Promise<Promise<boolean>>> // boolean

// 最好的做法是递归提取
type PromiseVal3<T> = T extends Promise<infer V> ? PromiseVal3<V> : T
```

其实, `infer` 的作用就是为条件类型在泛型的基础上支持了基于类型信息的动态条件判断,也可直接消费(提取)填充类型信息

### 分布式条件类型

**分布式条件类型,也称为条件类型的分布式特性**,在条件类型满足一定情况下会执行的逻辑

```ts
type Condition<T> = T extends 1 | 2 | 3 ? T : never

type Res = Condition<1 | 2 | 3 | 4 | 5> // 1 | 2 | 3
type Res2 = 1 | 2 | 3 | 4 | 5 extends 1 | 2 | 3 ? 1 | 2 | 3 | 4 | 5 : never // never
```

为什么这两种返回的类型别名不一致? `Res` 中返回的是一个联合类型?

从字面上只有一个差异,在 `Res` 中,进行判断的联合类型被作为泛型参数传入给另一个独立的类型别名,而 `Res2` 中直接对着两者进行判断

第一个差异: **是否通过泛型参数传入**

```ts
type Naked<T> = T extends boolean ? 'Y' : 'N'
type Warpped<T> = [T] extends [boolean] ? 'Y' : 'N'

type Res3 = Naked<number | boolean> // 'N' | 'Y'
type Res4 = Warpped<number | boolean> // 'N'
```

这两个例子都是用泛型参数传入的,但 `Res3` 还是一个联合类型, `Res4` 是因为元祖的成员有可能是数字类型,显然不兼容与 `[boolean]`,这两个例子的区别是: 条件类型中的**泛型参数是否被数组包裹了**

所以条件类型分布式起作用的条件:

- 类型参数需要是一个联合类型
- 类型参数需要通过泛型参数的方式传入,而不能直接进行条件类型判断
- 条件类型中的泛型参数不能被包裹

条件分布式特性会产生的效果很明显,即是将这个联合类型拆开来,每个分支分别进行一次条件类型判断,再将最后的结果合并起来.

官方解释: **对于裸类型参数的检查类型,条件类型会在实例化时期自动分发到联合类型上**

自动分发可以这么理解

```ts
type Naked<T> = T extends boolean ? 'Y' : 'N'
// (number extends boolean ? 'Y' : 'N') | (boolean extends boolean ? 'Y' : 'N')
type Res3 = Naked<number | boolean> // 'N' | 'Y'

// 伪代码
const Res3 = []
for (const val of [number,boolean]) {
  if(val extends number){
    Res3.push('Y')
  }else{
    Res3.push('N')
  }
}
```

裸类型参数,其实指的就是泛参数是否完全裸露

```ts
// T & {} 的意义是阻止分发,裸类型会触发分发,从而返回联合类型,数组 | 元祖 | 对象 不会触发分发
type NoDistribute<T> = T & {}
type Warpped<T> = NoDistribute<T> extends boolean ? 'Y' : 'N'

type Res = Warpped<number | boolean> // 'N'
type Res2 = Warpped<true | false> // 'Y'
type Res3 = Warpped<false | 599> // 'N'
```

我们并不是只会通过裸露泛型参数,来确保分布式特性能够发生.在某些情况下,我们也会需要包裹泛型参数来禁用掉分布式特性.最常见的场景也许还是联合类型的判断,即我们不希望进行联合类型成员的分布判断,而是希望直接判断这两个联合类型的兼容性判断

```ts
type CompareUnion<T, U> = [T] extends [U] ? 'Y' : 'N'

type CompareRes = CompareUnion<1 | 2, 1 | 2 | 3> // 'Y'
type CompareRes2 = CompareUnion<1, 2 | 1> // 'N'
```

通过将参数与条件都包裹的方式,将联合类型的比较变成了数组成员的比较,此时就会严格遵守类型层级中联合类型的判断(子集为子类型)

判断一个类型是否为 `never`

```ts
type IsNever<T> = [T] extends [never] ? 'Y' : 'N'

type IsNeverRes = IsNever<never> // 'Y'
type IsNeverRes2 = IsNever<'symbol'> // 'N'
```

`never` 和 `type` 的情况并不相同, `any` 在直接**作为判断参数时,作为泛型参数时**都会产生这一效果

```ts
// 直接使用,联合类型
type Tmp = any extends string ? 'Y' : 'N' // 'Y' | 'N'

// 通过泛型传入,联合类型
type Tmp2<T> = T extends string ? 'Y' : 'N' // 'Y' | 'N'
type Tmp2Res = Tmp2<any>

// 如果判断条件是 any 那么依旧会进行判断
type Special = any extends any ? 'Y' : 'N' // 'Y'
type Special2<T> = T extends any ? 'Y' : 'N'
type Special2Res = Special2<any> // 'Y'
```

## 工具类型

内置的工具类型按照类型操作的不同,可以大致分为以下几类:

- 对属性的修饰,包括对象属性和数组元素可选/必选,只读/可写.我们将这一类统称为**属性修饰工具类型**
- 对既有类型的裁剪,拼接,转换等.比如使用对一个对象类型裁剪得到一个新的对象类型,将联合类型结构转换到交叉类型结构.我们将这一类统称为**结构工具类型**
- 对集合(即联合类型)的处理,即交集,并集,差集,补集.我们将这一类统称为**集合工具类型**
- 基于 `infer` 的模式匹配,即对一个既有类型特定位置类型的提取,比如提取函数类型签名中的返回值类型.我们将其统称为**模式匹配工具类型**
- 模板字符串专属的工具类型,比如神奇地将一个对象类型中的所有属性名转换为大驼峰的形式,这一类统称为**模板字符串工具类型**

### 属性修饰工具类型

这一部分的工具类型主要使用**属性修饰,映射类型与索引类型**相关(索引类型签名,索引类型访问,索引类型查询均有使用,这里直接使用索引类型指代)

访问修饰工具

```ts
// 可选属性
type Partial<T> = {
  [K in keyof T]?: T[K]
}
type Partial2<T> = {
  [K in keyof T]+?: T[K]
}

// -? 作用是如果原本属性有 ? 标记则移除它
type Required<T> = {
  [K in keyof T]-?: T[K]
}

// 只读属性
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}
```

:::warning
可选标记不等于修改此属性为 `此原型 | undefined`,因为对于结构声明来说,一个属性是否必须提供取决于其是否携带可选标记,使用 `undefined` 或 `never` 也无法标记这个属性为可选
:::

```ts
interface Foo {
  name: string | undefined
  age: number
}
// 类型 "{ age: number; }" 中缺少属性 "name"，但类型 "Foo" 中需要该属性。
const fooRes: Foo = {
  age: 18,
}

interface Foo2 {
  name: never
  age: number
}
const fooRes2: Foo2 = {
  age: 18,
  name: '', // 不能将类型“string”分配给类型“never”。
}
```

类似于 `+?` , `Readonly` 中也可以使用 `+readonly`

```ts
type Readonly<T> = {
  +readonly [K in keyof T]: T[K]
}
const readonlyVal: Readonly<{ name: string; age: number }> = {
  name: 'symbol',
  age: 18,
}
// 无法为“name”赋值，因为它是只读属性。
readonlyVal.name = 'xxxx'

// 将属性中的 `readonly` 修饰移除
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

const mutableVal: { readonly name: string; age: number } = {
  name: 'symbol',
  age: 18,
}
// 无法为“name”赋值，因为它是只读属性。
mutableVal.name = 'xxx'

const mutableVal2: Mutable<{ readonly name: string; age: number }> = {
  name: 'symbol',
  age: 18,
}
mutableVal2.name = 'xxx'
```

### 结构工具类型

这一部分的工具类型主要使用**条件类型**以及**映射类型,索引类型**

结构工具类型其实又可以分为两类: **结构声明**和**结构处理**

```ts
// 例如 内置类型中的 Record
type Record<K extends keyof any, T> = {
  [V in K]: T
}
```

其中, `K extends keyof any` 即为键的类型,这里使用 `extends keyof any` 标明,传入的 `K` 可以是单个类型,也可以是联合类型,而 `T` 即为属性的类型

```ts
// 键名类型为 string ,键值类型未知
type Record2 = Record<string, unknown>
// 键名类型为 string ,键值类型任意
type Record3 = Record<string, any>
// 键名类型为 string | number ,键值类型任意
type Record4 = Record<string | number, any>
```

其中,`Record<string, unknown>` 和 `Record<string, any>` 通常用来使用这两者代替 `object`

在一些工具类库中其实还存在类似的结构声明工具类型

```ts
// 字典结构字需要一个作为属性类型的泛型参数即可
type Dictionary<T> = {
  [index: string]: T
}

type NumericDictionary<T> = {
  [index: number]: T
}
```

结构处理工具类型,在 `ts` 中主要是 `Pick` 和 `Omit`

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

`Pick` 它接受两个泛型参数,`T` 即是我们会进行结构处理的原类型(一般是对象类型),而 `K` 则被约束为 `T` 类型的键名联合类型.由于泛型约束时立即填充推导的,即你为第一个泛型参数传入 `Foo` 以后, `K` 的约束条件会立刻被填充,因此在你输入 `K` 时会立即后的代码提示

```ts
interface Foo {
  name: string
  age: number
}

type PickEdFoo = Pick<Foo, 'name' | 'age'>
```

`Pick` 会将传入的联合类型作为需要保留的属性,使用这一联合类型配合印射类型

```ts
// 等价于
type Pick<T> = {
  [P in 'name' | 'age']: T[P]
}
```

联合类型的成员会被依次印射,并通过索引类型访问来获取到它们本来的类型

而对于 `Omit` 类型,看名字其实就知道它是 `Pick` 的反向实现:**`Pick` 是保留这些传入的键**,比兔冲一个庞大的结构中选择少数字段保留,需要的是这些少数字段,而**`Omit` 则是移除这些传入的键**,也就是从一个庞大的结构中剔除少数字段,需要的是剩余的多数部分

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

`Omit` 是基于 `Pick` 实现的,这也是 `ts` 中成对工具类型的另一种实现方式. 上面的 `Partial` 和 `Required` 使用类似的结构,**在关键位置使用一个相反操作来实现反向**,而这里的 `Omit` 类型则是基于 `Pick` 类型实现,也就是**反向工具类型基于正向工具类型实现**

首选来看 `Exclude<A,B>` 的结果就是联合类型 `A` 中不存在于 `B` 中的部分

```ts
type Res = Exclude<1, 2> // 1
type Res2 = Exclude<1 | 2 | 3, 2 | 4> // 1 | 3
```

所以,这里的 `Exclude<keyof T, K>` 其实就是 `T` 的键名联合类型中剔除了 `K` 的部分,将其作为 `Pick` 的键名,就实现了剔除这一部分的效果

### 集合工具类型

这一部分的工具类型主要是使用条件类型,条件类型分布式特性

- **并集**: 两个集合的合并,合并时重复的元素只会保留一份(联合类型的表现行为)
- **交集**: 两个集合的相交部分,及同事存在于这两个集合内的元素组成的集合
- **差集**: 对于 `A` `B` 两个集合来说, `A` 相对于 `B` 的差集即为 **`A` 中独有而 `B` 中不存在的元素**组成的集合,或者说 **`A` 中剔除了 `B` 中存在的元素以后,还剩下的部分**
- **补集**: 补集是差集的特殊情况,此时**集合 `B` 为集合的子集**,在这种情况下 **`A` 相对于 `B` 的差集 + `B` = 完整的集合 `A`**

内置工具类型中提供了交集与差集的实现

```ts
// 交集
type Extract<T, U> = T extends U ? T : never
// 差集
type Exclude<T, U> = T extends U ? never : T
```

这里是实现其实就是条件类型的分布式特性,即当 `T`,`U` 都是联合类型(视为一个集合)时,`T` 的成员回一次被拿出来进行 `extends U ? T1 : T2` 的计算,然后将最终的结果再合并成为联合类型

比如交集 `Extract`

```ts
type AExtractB = Extract<1 | 2 | 3, 1 | 2 | 4 | 5> // 1 | 2

type _AExtractB =
  | (1 extends 1 | 2 | 4 | 5 ? 1 : never) // 1
  | (2 extends 1 | 2 | 4 | 5 ? 2 : never) // 2
  | (3 extends 1 | 2 | 4 | 5 ? 3 : never) // never
```

`Exclude` 也是了类似,需要注意的是,差集存在相对的概念,即 `A` 相对于 `B` 的差集与 `B` 相对于 `A` 的差集不一定相同,而交集则一定相同

```ts
type SetA = 1 | 2 | 3 | 5
type SetB = 0 | 1 | 2 | 4
type AExcludeB = Exclude<SetA, SetB> // 3 | 5
type BExcludeA = Exclude<SetB, SetA> // 0 | 4

type _AExcludeB =
  | (1 extends 0 | 1 | 2 | 4 ? never : 1) // 1
  | (2 extends 0 | 1 | 2 | 4 ? never : 2) // 2
  | (3 extends 0 | 1 | 2 | 4 ? never : 3) // never
  | (5 extends 0 | 1 | 2 | 4 ? never : 5) // never
```

并集与交集

```ts
// 并集
type Concurrence<A, B> = A | B
// 交集
type Intersection<A, B> = A extends B ? A : never
// 差集
type Difference<A, B> = A extends B ? never : A
// 补集
type Conmplement<A, B extends A> = Difference<A, B>
```

补集基于差集实现,只需要约束**集合 `B` 为集合 `A` 的子集**即可

### 模式匹配工具类型

这一部分的工具类型主要使用**条件类型**和 **`infer` 关键字**,更严格地说 `infer` 其实代表了一种**模式匹配**的思路.如正则表达式,Glob 中等都体现了这一概念
函数类型签名的模式匹配

```ts
type FunctionType = (...args: any) => any
type Parameters<T extends FunctionType> = T extends (...args: infer P) => any
  ? P
  : never
type ReturnType<T extends FunctionType> = T extends (...args: any) => infer R
  ? R
  : any
```

根据 `infer` 的位置不同,我们就能够获取不同位置的类型,在函数这里则是参数类型与返回值类型

只匹配一个参数类型

```ts
type FirstParameter<T extends FunctionType> = T extends (
  first: infer P,
  ...args: any
) => any
  ? P
  : never

type FuncFoo = (arg: number) => void
type FuncBar = (...args: string[]) => void

type FooFirstParameter = FirstParameter<FuncFoo> // number
type BarFirstParameter = FirstParameter<FuncBar> // string
```

除了对函数类型进行模式匹配,内置工具类型中还有一组 `Class` 进行模式匹配的工具类型

```ts
type ClassType = abstract new (...args: any) => any

type ConstrutorParameters<T extends ClassType> = T extends abstract new (
  ...args: infer P
) => any
  ? P
  : never
type InstanceType<T extends ClassType> = T extends abstract new (
  ...args: any
) => infer R
  ? R
  : any
```

或者使用接口声明

```ts
interface ClassType<TInstanceType = any> {
  new (...args: any[]): TInstanceType
}
```

对 `Class` 的模式匹配思路类似于函数,或者说这是一个通用的思路,即基于放置位置的匹配.方在参数部分,那就是构造函数的参数类型,放在返回值部分,那当然就是 `Class` 的实例类型了

## 上下文类型

```ts
window.onerror = (event, source, line, col, err) => {}
```

在这个例子中,并没有为 `onerror` 的各个参数声明类型,但是它们已经获得了正确的类型

```ts
interface OnErrorEventHandlerNonNull {
  (
    event: Event | string,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error
  ): any
}

type OnErrorEventHandler = OnErrorEventHandlerNonNull | null

declare var onerror: OnErrorEventHandler
```

例如:实现函数签名

```ts
type CustomHandler = (name: string, age: number) => boolean
// 推导出了参数类型
const handler: CustomHandler = (arg1, arg2) => true
```

除了参数类型,返回值类型同样会纳入管控

```ts
declare const struct: {
  handler: CustomHandler
}
// 不能将类型“void”分配给类型“boolean”
struct.handler = (name, age) => {}
```

不仅仅是箭头函数,函数表达式也可以

在这里,参数的类型基于其上下文的参数类型位置来进行匹配,`arg1` 对应到 `name`,所以是 `string`类型,`arg2` 对应到 `age`,所以是 `number` 类型.这就是上下文类型的核心理念:**基于位置的类型推导**.

在上下文类型中,我们实现的表达式可以只使用更少的采纳数,而不能使用更多,这是因为**上下文是基于位置的匹配**,一旦参数葛素超过了定义的数量,没法进行匹配

```ts
window.onerror = (event) => {}
// error
window.onerror = (event, source, line, col, err, extra) => {}
```

嵌套推导

```ts
let func: (raw: number) => (val: string) => any
// raw:number
func = (raw) => {
  // val:string
  return (val) => {}
}
```

在某些情况下,上下文类型的推导能力也会失效

```ts
class Foo {
  foo!: number
}
class Bar extends Foo {
  bar!: number
}
let func2: { (val: Foo): void } | { (val: Bar): void }
// 参数“val”隐式具有“any”类型
func2 = (val) => {}
```

预期的结果是 `val` 被推导成为 `Foo | Bar` 类型,也就是所有符合结构的函数类型的参数.这是因为 `ts` 中的上下文类型目前暂时不支持这一判断方式

可以直接使用一个联合类型参数的函数签名

```ts
let func3: { (val: Foo | Bar): void }
// 推导成为 Bar | Foo
func3 = (val) => {}
```

### void 返回值类型下的特殊情况

上下文类型同样会推导并约束函数的返回值类型,但存在个特殊情况,当内置函数类型的返回值为 `void` 时

```ts
type CustomHandler = (name: string, age: number) => void

const handler: CustomHandler = (name, age) => true
const handler2: CustomHandler = (name, age) => 'symbol'
const handler3: CustomHandler = (name, age) => null
const handler4: CustomHandler = (name, age) => undefined
```

这时函数返回值类型可以为任意的类型,而且不会报错.**上下文类型对于 `void` 返回值的函数,并不会整的要求它什么都不返回**.然而,虽然这些函数实现可以返回任意类型的值,但**对于调用结果的类型,仍然是 `void`**

```ts
const res = handler('symbol', 18) // void
const res2 = handler2('symbol', 18) // void
const res3 = handler3('symbol', 18) // void
const res4 = handler4('symbol', 18) // void
```

但是我们实际开发却需要这个'不正确的错误'

```ts
const arr: number[] = []
const list: number[] = []
list.forEach((x) => arr.push(x))
```

`push` 方法返回值是一个 `number` 类型(`push` 后数组的长度).而 `forEach` 的上下文类型生命中要求返回值的类型是 `void` 类型

可以\*\*将返回值非 `void` 的函数(`()=>list.push()`) 作为返回值类型为 `void` 类型(`arr.forEach`)的函数类型参数

## 函数类型: 协变与逆变的比较

### 如何比较函数的签名类型

首先需要明确的是,我们不会使用函数类型去和其他类型(如对象类型)比较,因为这并没有意义

例子:给出具有三个具有层级关系的类,分别代表动物,狗,柯基

```ts
class Animal {
  asPet() {}
}
class Dog extends Animal {
  bark() {}
}
class Corgi extends Dog {
  cute() {}
}
```

定义一个接受 `Dog` 类型并返回 `Dog` 类型的函数

```ts
type DogFactory = (args: Dog) => Dog
```

对于函数类型的比较,实际上我们要比较的即是参数类型与返回值类型.对于 `Animal`,`Dog`,`Corgi`这三个类,如果将它们分别可重复的放置在参数类型与返回值类型处(相当于排列组合),可以得到以下函数签名类型

> 这里不包括 `Dog` => `Dog`,因为我们要用它作为基础来**被**比较

- `Animal` => `Animal`
- `Animal` => `Dog`
- `Animal` => `Corgi`
- `Dog` => `Dog`
- `Dog` => `Animal`
- `Dog` => `Corgi`
- `Corgi` => `Animal`
- `Corgi` => `Dog`
- `Corgi` => `Corgi`

直接比较完整的函数类型并不符合我们的思维,因此需要引入一个辅助函数: 它接收一个 `Dog` => `Dog` 类型的参数

```ts
function transformDogAndBark(dogFactory: DogFactory) {
  const dog = dogFactory(new Dog())
  dog.bark()
}
```

对于函数参数,**如果一个值能够被赋值给某个类型的变量,那么可以认为这个值的类型为此变量的子类型**

如一个简单接受 `Dog` 类型参数的函数

```ts
function makeDogBark(dog: Dog) {
  dog.bark()
}
```

它在调用时只能接受 `Dog` 类型或 `Dog` 类型的子类型,而不能接受 `Dog` 类型的父类型

```ts
makeDogBark(new Corgi())
// 类型“Animal”的参数不能赋给类型“Dog”的参数
makeDogBark(new Animal())
```

相对来说,因为派生类(即子类)会保留基类的属性和方法,因此说其与基类兼容,但基类并不能未卜先知拥有子类的方法.

> **子类可以拓展父类的方法,但不能改变父类原有的功能,子类型必须能够替换掉它们的基类型**

对于这两条约束依次进行检查

```ts
// 不能将类型“(val: Animal) => Animal”分配给类型“DogFactory”。
const factory: DogFactory = (val: Animal) => {
  return val
}
const factory2: DogFactory = (val: Animal) => {
  return new Dog()
}
const factory3: DogFactory = (val: Animal) => {
  return new Corgi()
}
const factory4: DogFactory = (val: Dog) => {
  return val
}
// 不能将类型“(val: Dog) => Animal”分配给类型“DogFactory”。
const factory5: DogFactory = (val: Dog) => {
  return new Animal()
}
const factory6: DogFactory = (val: Dog) => {
  return new Corgi()
}
// 不能将类型“(val: Corgi) => Animal”分配给类型“DogFactory”。
const factory7: DogFactory = (val: Corgi) => {
  return new Animal()
}
// 不能将类型“(val: Corgi) => Dog”分配给类型“DogFactory”。
const factory8: DogFactory = (val: Corgi) => {
  return new Dog()
}
// 不能将类型“(val: Corgi) => Corgi”分配给类型“DogFactory”。
const factory9: DogFactory = (val: Corgi) => {
  return val
}
```

- 对于 `Animal/Dog/Corgi => Animal` 类型,无论它的参数类型是什么,它的返回值都是不满足条件的.
- 对于 `Corgi => Corgi` 与 `Corgi => Dog`,其返回值满足了条件,但是参数类型又不满足了.这两个类型需要接受 `Corgi` 类型,可能内部需要它的特性.
- 对于 `Dog => Corgi`,`Animal => Corgi`,`Animal => Dog`,首先它们的参数类型正确的满足了约束

结论:

- 参数类型**允许**为 `Dog` 的父类型,**不允许**为 `Dog` 的子类型(不包含自身)
- 返回值类型**允许**为 `Dog` 的子类型(不包含自身),**不允许**为 `Dog` 父类型

因为这里使用的是 `Dog => Dog` 作为基准比较的,当去掉包含 `Dog` 类型的例子,只剩下 `Animal => Corgi` 了,即`(Animal => Congi) <= (Dog => Dog)` 成立(`A <= B` 意为 `A` 为 `B` 的子类型)

这里用来比较的两个函数类型,其实就是把具有父子关系的类型放置在参数位置以及返回值位置上,**最终函数类型的关系直接取决于类型的父子关系**

### 协变与逆变

考虑 `Corgi <= Dog <= Animal` 且有函数类型 `Dog => Dog`,仅有 `(Animal => Congi) <= (Dog => Dog)` 成立(即能视为此函数的子类型).当我门将其拆解:

考虑 `Corgi <= Dog`,假设我们对其进行返回值类型的函数签名类型包装,则有 `(T => Corgi) <= (T => Dog)`.即不考虑返回值类型的情况,在包装为函数签名的参数类型后,其子类型关系发生了逆转

在 `ts` 中,如果有 `A <= B`,协变意味着 `Wrapper<A> <= Warpper<B>`,逆变意味着 `Wrapper<B> <= Warpper<A>`

在这里的**变化指的是从单个类型到函数类型的包装过程**

```ts
type AsFuncArgType<T> = (arg: T) => void
type AFuncReturnType<T> = (arg: unknown) => T

// 'Y'  成立  (T => Corgi) <= (T => Dog)
type CheckReturnType = AFuncReturnType<Corgi> extends AFuncReturnType<Dog>
  ? 'Y'
  : 'N'

// 'N' 不成立  (Dog => T) <= (Animal => T)
type CheckArgType = AsFuncArgType<Dog> extends AsFuncArgType<Animal> ? 'Y' : 'N'
```

函数类型的参数类型使用子类型逆变(`A` <= `B`)的方式确定是否成立,而返回值类型使用子类型协变(`B` <= `A`)的方式确定

在 `tsconfig` 配置中有 `strictFunctionTypes` 这一项配置:**在比较两个函数类型是否兼容时,将对函数参数进行更严格的检查**.这里的更严格指的即是**对函数参数类型启用逆变检查**

```ts
function fn(dog: Dog) {
  dog.bark()
}

type CorgiFunc = (val: Corgi) => void
type AnimalFunc = (val: Animal) => void

const func: CorgiFunc = fn
// 不能将类型“(dog: Dog) => void”分配给类型“AnimalFunc”
const func2: AnimalFunc = fn
```

这两个赋值操作等价于

- `(Dog => T) <= (Corgi => T)`
- `(Dog => T) <= (Animal => T)`

在开启 `strictFunctionTypes` 的情况下,`ts` 会抛出错误.关闭的情况下,对函数参数的检查采用的时**双变**,**即逆变和协变都会被认为是可接受的**

## 内置工具类型的进阶

### 属性修饰进阶

- 深层的属性修饰
- 基于已知属性的部分修饰,以及基于属性类型的部分修饰

例如 `infer` 关键字递归的工具类型

```ts
type PromiseVal<T> = T extends Promise<infer V> ? PromiseVal<V> : T
```

在条件成立时,会再次调用这个工具类型.在某一次递归到条件类型不成立时,就会直接返回这个类型值

```ts
type DeepPartial<T extends object> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
```

这里直接使用 `object` 作为泛型约束与条件,可能传入函数,数组等类型

为了更直观的验证它的效果,可以使用 [tsd](https://www.npmjs.com/package/tsd) 工具类型单元测试库来进行验证

```ts
import { expectType } from 'tsd'
type DeepPartial<T extends object> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

type DeepPartialStruct = DeepPartial<{
  foo: string
  nested: {
    nestedFoo: string
    nestedBar: {
      nestedBarFoo: string
    }
  }
}>

expectType<DeepPartialStruct>({
  foo: 'bar',
  nested: {},
})

expectType<DeepPartialStruct>({
  nested: {
    nestedBar: {
      nestedBarFoo: undefined,
    },
  },
})
```

在 `expectType` 的泛型坑位中传入一个类型,然后再传入一个值,就可以验证这个值是否符合泛型类型

类似可以实现其他进行递归属性修饰的工具类型

```ts
type DeepPartial<T extends object> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
// -? 作用是如果原本属性有 ? 标记则移除它
type DeepRequired<T extends object> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K]
}

type DeepReadonly<T extends object> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}
type DeepMutable<T extends object> = {
  -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K]
}
```

之前有个常用的工具类型,将 `null | undefined` 从联合类型中去除

```ts
type NonNullable<T> = T extends null | undefined ? never : T
```

在对象结构中常声明类型为 `null` | `string` 的形式,代表了"**这里有值,但可能是空值**".此时,可以将其等价为一种属性修饰(`Nullable` 属性,前面则是 `Optional`/`Readonly` 属性).因此,可以像访问修饰工具类型那样,实现一个 `DeepNonNullable` 来递归去除所有属性的 `null` 和 `undefined`

```ts
type DeepNonNullable<T extends object> = {
  [K in keyof T]: T[K] extends object
    ? DeepNonNullable<T[K]>
    : NonNullable<T[K]>
}
```

相对于关系 `DeepNullable`

```ts
type NullType<T> = T | null
type DeepNullType<T extends object> = {
  [K in keyof T]: T[K] extends object ? DeepNullType<T[K]> : NullType<T[K]>
}
```

:::warning
注意: `DeepNonNullable` 和 `DeepNullType` 需要在开启 `strictNullChecks` 下才能正常工作
:::

接着就是**基于已知属性进行部分修饰**,如果要让一个对象的是三个已知属性为可选的,只要把这个对象拆成`A` 和 `B` 两个对象结构,分别由三个属性和其他属性组成.然后让对象 `A` 的属性全部变为可选,和另外一个对象组合起来

- 拆分对象结构,即结构工具类型中的 **`Pcik` 和 `Omit`**
- 三个属性的对象变成可选,就是属性修饰,即**递归属性修饰**
- 组合两个对象类型,也就意味着得到一个同时拥有这两个对象类型的新结构,即**交叉类型**

```ts
type MarkPropsAsOptional<
  T extends object,
  K extends keyof T = keyof T
> = Partial<Pick<T, K>> & Omit<T, K>

type MarkPropsAsOptionalStruct = MarkPropsAsOptional<
  { foo: string; bar: number; baz: boolean },
  'bar'
>
// type MarkPropsAsOptionalStruct = Partial<Pick<{
//   foo: string;
//   bar: number;
//   baz: boolean;
// }, "bar">> & Omit<{
//   foo: string;
//   bar: number;
//   baz: boolean;
// }, "bar">

// 拍平为单层对象结构
type Flatten<T> = { [K in keyof T]: T[K] }
type FlatMarkPropsAsOptionalStruct = Flatten<MarkPropsAsOptionalStruct>
// type FlatMarkPropsAsOptionalStruct = {
//   bar?: number | undefined;
//   foo: string;
//   baz: boolean;
// }
```

### 结构工具类型进阶

- 基于键值类型的 `Pick` 和 `Omit`
- 子结构的互斥处理

这里无法预先确定要拆分的属性,需要**基于期望的类型去拿到所有此类型的属性名**

```ts
type FuncStruct = (...args: any[]) => any

type FunctionKeys<T extends object> = {
  [K in keyof T]: T[K] extends FuncStruct ? K : never
}[keyof T]
```

`{}[keyof T]` 之前没有见过,可拆开来看,先看前面的 `{[K in keyof T]:T[K] extends FuncStruct ? K : never }`部分,为何在条件类型成立时它返回了键名 `K` 而非索引类型查询 `T[K]`

```ts
type Tmp<T extends object> = {
  [K in keyof T]: T[K] extends FuncStruct ? K : never
}
type Res = Tmp<{
  foo: () => void
  bar: () => void
  baz: number
}>
// 等同于
// type ResEqual = {
//   foo: 'foo'
//   bar: 'bar'
//   baz: never
// }
```

在 `Res` 中,我们获取了一个**属性名-属性名字面量类型**的结构,对于非函数类型的属性,其值为 `never`.然后,加上 `[keyof T]` 这一索引类型查询 `+ keyof` 操作符的组合

```ts
type WhatWillWeGet = Res[keyof Res] // 'foo' | 'bar'

// 可以看做以下
type WhatWillWeGetEqual = Res['foo' | 'bar' | 'baz']
type WhatWillWeGetEqual2 = Res['foo'] | Res['bar'] | Res['baz']
type WhatWillWeGetEqual3 = 'foo' | 'bar' | never
```

当索引类型中使用可一个联合类型,它会使用类似分布式条件类型的方式,将这个联合类型的成员依次进行访问,然后再组合起来.通过这一方式,可以获取到符合预期类型的属性名了.如果希望抽象'基于键值类型查找属性'这个逻辑,需要对 `FunctionKeys` 的逻辑进行封装,即**将预期的类型也作为泛型参数**,由外部传入

```ts
type ExpectedPropKeys<T extends object, ValueType> = {
  [K in keyof T]-?: T[K] extends ValueType ? K : never
}[keyof T]

type FunctionKeys2<T extends object> = ExpectedPropKeys<T, FuncStruct>

expectType<
  FunctionKeys2<{
    foo: () => void
    bar: () => void
    baz: number
  }>
>('foo')
expectType<
  FunctionKeys2<{
    foo: () => void
    bar: () => void
    baz: number
  }>
>('baz')
// error 因为 baz 不是函数类型属性
```

既然我们现在可以拿到对应类型的属性名,那么把这些属性交给 `Pick`,可以得到这些属性组成的子结构

```ts
type PcikByValueType<T extends object, ValueType> = Pick<
  T,
  ExpectedPropKeys<T, ValueType>
>
expectType<PcikByValueType<{ foo: string; bar: number }, string>>({
  foo: 'symbol',
})

expectType<
  PcikByValueType<{ foo: string; bar: number; baz: boolean }, string | number>
>({
  foo: 'symbol',
  bar: 18,
})
```

`Omit` 也是类似的,只不过需要一个和 `ExpectedPropKeys` 相反的工具类型即可,主需要调换条件类型语句返回结果两端即可

```ts
type FilterePropKeys<T extends object, ValueType> = {
  [K in keyof T]-?: T[K] extends ValueType ? never : K
}[keyof T]

type OmitByValueType<T extends object, ValueType> = Pick<
  T,
  FilterePropKeys<T, ValueType>
>
expectType<OmitByValueType<{ foo: string; bar: number }, string>>({ bar: 18 })

expectType<
  OmitByValueType<{ foo: string; bar: number; baz: boolean }, string | number>
>({ baz: true })
```

## 类型声明 类型指令与命名空间(工程层面)

### 类型检查指令

在许多语言中,其实都提供了**行内注释**的能力,用与支持在某一处特定点啊**使用特殊的配置来覆盖掉全局配置**,最常见的是 `ESlint` 和 `Prettier` 提供的禁用检查能力,如 `/* eslint-disable-next-lint */`,`<!-- prettier-ignore -->` 等.同样 `ts` 中同样提供了数个行内注释(这里称为类型指令),来进行单行代码或单文件级别的配置能力.这些指令均以 `// @ts-` 开头

### ts-ignore 与 ts-expect-error

`ts-ignore` 应该是使用最为广泛的一个类型指令,它的作用就是直接禁用掉对下一行代码的类型检查

```ts
// @ts-ignore
// 不能将类型“number”分配给类型“string”
const name: string = 599
```

基本上所有的类型报错都可以通过这个指令来解决,但由于它本质上 `ignore` 而不是 `disable`,也就意味着如果下一行代码并没有问题,那使用 `ignore` 反而就是一个错误.因此 `ts` 引入了一个更严格版本的 `ignore`,即 `ts-expect-error`,它只有在**下一行代码真的存在错误时**才能被使用,否则它会给出一个错误

```ts
// @ts-expect-error
const name: string = 599

// @ts-expect-error 无意义的 expect-error 指令
const age: number = 599
```

但是建议在项目中不要使用 `ts-ignore` 和 `@ts-expect-error`.对于这类指令,本来就应当确保**下一行真的存在错误时**才去使用

这两个指令只能对单行代码生效,但如果我们有非常多的类型报错要处理(比如正在将一个 `JavaScript` 文件迁移到 `TypeScript`),难道要一个个为所有报错的地方都添加上禁用检查指令?当然不需要,正如 `ESLint` 中可以使用 `/* eslint-disable-next-line */` 禁用下一行代码检查,也可以使用 `/* eslint-disable */` 禁用整个文件检查一样, `TypeScript` 中也提供了对整个文件生效的类型指令: `ts-check` 与 `ts-nocheck`

### ts-check 与 ts-nocheck

`ts-nocheck` 可以把它理解为一个作用于整个文件的 `ignore` 指令,使用了 `ts-nocheck` 指令的 `ts` 文件将不再接受类型检查

```ts
// @ts-nocheck 写在文件顶部,此文件将不会接受类型检查
const name: string = 666
const age: number = 'symbol'
```

`ts-check` 像是多余,因为 `ts` 默认情况下会检查类型.但是实际上 `TypeScript` 并不是只能检查 `ts` 文件,对于 `js` 文件它也可以通过类型推导与 `JSDoc` 的方式进行不完全的类型检查

```js
let age = 18

/** @type {string} */
let myName

class Foo {
  prop = 666
}
```

声明初始值的 `age` 和 `Foo.prop` 都能被推导出其类型,而无初始值的 `myName` 也可以通过 `JSDoc` 标注的方式来显示的标注类型

但是 `js` 是弱类型语言,表现之一即是变量可以**被赋值为与初始值类型不一致的值**

```js
let age = 18
age = 'symbol'

/** @type {string} */
let myName
myName = 666
```

这种赋值方式在类型层面显然是不成立的,但是是在 `js` 文件中,这里并不会类型报错,如果希望在 `js` 文件中也能享受到类型检查,`ts-check` 指令就可以实现

```js
// @ts-check
let age = 18
// 不能将类型“string”分配给类型“number”
age = 'symbol'

/** @type {string} */
let myName
// 不能将类型“number”分配给类型“string”
myName = 666
```

这里的 `ts-check` 指令为 `js` 文件也带来了类型检查,同时还可以使用 `ts-expect-error` 指令来忽略单行的代码检查

```js
// @ts-check
let age = 18
// @ts-expect-error
age = 'symbol'

/** @type {string} */
let myName
// @ts-expect-error
myName = 666
```

而 `ts-nocheck` 在 `js` 文件中的作用和 `ts` 文件其实也是一致,即禁用掉对当前文件的检查,如果并不希望开启对所有的 `js` 文件的检查,需要忽略少数文件.可以在 `tsconfig` 中启用 `checkJs` 配置,来开启**对所有开启的 `js` 文件的类型检查**,然后使用 `ts-nocheck` 来忽略部分 `js` 文件

### 类型声明

其实就是 `declare` 语法

```ts
declare var func: () => void

declare interface Foo {
  prop: string
}

declare function foo(val: Foo): Foo

declare class Foo {}
```

在别的 `ts` 文件中可以直接使用

```ts
let otherProp: Foo['prop']

// 不允许在环境上下文中使用初始化表达式。
declare let result = foo({ prop: 'symbol' })

declare let result2: ReturnType<typeof foo>
```

在编译后会生成一个 `.js` 文件和一个 `.d.ts` 文件,后者是类型声明文件

### 让类型定义覆盖项目

场景:

- 想要使用一个 `npm` 包,但它发布的时间太早,根本没有携带类型定义,于是你的项目里就出现了这么一处没有被类型覆盖的地方
- 你想要在代码里导入一些非代码文件,反正 `Webpack` 会帮你处理,但是 `TS` 又报错了
- 这个项目在运行时动态注入了一些全局变量(如 `window.errorReporter`),你想要在代码里直接这样访问,却发现类型又报错了...

这些问题可以通过类型声明来解决,这也是它的核心能力: **通过额外的类型声明文件,在核心的代码文件以外去提供对类型的进一步补全**.类型声明文件,即 `.d.ts` 后缀的文件,它会自动地被 `ts` 加载到环境中,实现对应部分代码的类型补全

声明文件并不包含实际的代码逻辑,它**只为 `ts` 类型检查与推导提供额外的类型信息**,而使用的语法仍然是 `ts` 的 `declare` 关键字

```ts
// 这里 npm 下载的是 无类型定义的 lodash
// 无法找到模块“lodash”的声明文件
import _ from 'lodash'
```

解决方法

```shell
# 下载对应的 DefinitelyTyped
npm install --save-dev @types/lodash
```

什么是 `DefinitelyTyped` ?简单来说, `@types/` 开头的这一类 `npm` 包均属于 `DefinitelyTyped`,它是 `ts` 维护的,专用于为社区存在的**无类型定义的 `js` 库**添加类型支持,如 `@types/lodash` 等

只要你安装了 `@types/lodash`, `ts` 会自动将其加载到环境中(实际上所有的 `@types/` 下的包都会自动被加载)

或者在 `.d.ts` 文件中添加类型声明进行补全

```ts
declare module 'lodash'
```

### 拓展已有的类型定义

```ts
declare var window: Window & typeof globalThis
```

当按住 `ctrl` 点击 `Window` 可以看到内部所有的类型声明

它定义了对浏览器文档独享模型的类型声明,这就是 `ts` 提供的内置类型

在 `js` 中当访问全局变量时,是可以直接忽略 `window`

```js
onclick = () => {}
```

在类型声明中,如果我们直接声明一个变量,那就相当于将它声明在了全局空间中

```ts
// 类型声明文件
declare const errRe: (err: any) => void
// 可以在任意地方直接使用
errRe('error')
```

如果需要将它加到已有的 `Window` 接口中.首先确定的是,如果有多个**同名接口**,那么这些接口实际上是**会合并**的

```ts
interface Window {
  userTracker: (...args: any[]) => Promise<void>
}

// 可以显示的使用
window.userTracker('click')
```

也可以拓展来自 `@types` 包的类型定义

```ts
declare module 'lodash' {
  export function bump(): void
}

import { bump } from 'lodash'
```

### 三斜线指令

三斜线指令就像是声明文件中导入语句一样,它的作用就是**声明当前的文件依赖的其他类型声明**.包括 `ts` 内置类型声明(`lib.d.ts`),三方库的类型声明以及自己提供的类型声明文件

三斜线的指令本质就是一个自闭合的 `XML` 标签

```ts
/// <reference path="./other.d.ts" />
/// <reference types="node" />
/// <reference lib="dom" />
```

**需要注意的是,三斜线指令必须被放置在文件的顶部才能生效**

这里的三条指令作用其实都是声明当前文件依赖的玩不类型声明,只不过使用的方式不同,分别使用了 `path` / `types` / `lib` 这三个不同属性

使用了 `path` 的 `reference` 指令,其 `path` 属性的值为一个相对路径,指向你项目内的其他声明文件.而在编译时, `ts` 会沿着 `path` 指定的路径不断深入寻找,最深的那个没有其他依赖的声明文件会被最先加载

```ts
// @types/node 中的示例
/// <reference path="fs.d.ts" />
```

使用 `types` 中的 `reference` 指令,其 `types` 的值是一个包名,也就是想引入的 `@types/` 声明,如上面的例子中我们实际上是在声明当前文件对 `@types/node` 的依赖.而如果你的代码文件(`.ts`) 中声明了对某一个包的类型导入,那么在编译产生的声明文件(`.d.ts`)中会自动包含引用它的指令

```ts
/// <reference types="node" />
```

使用 `lib` 的 `reference` 指令类似于 `types`,只不过这里 `lib` 导入的是 `ts` 内置的类型声明

```ts
/// vite/client.d.ts
/// <reference lib="dom" />
```

这三种指令的目的都是引入当前文件所以来的其他类型声明,只不过适用场景不同

### 命名空间

假设一个场景,有多种支付方式,最开始只有人民币和美元

```ts
class RmbPay {}

class DollarPay {}
```

之后随着业务的发展,新增了很多支付方式:微信支付,支付宝支付,信用卡支付...

```ts
class RmbPay {}

class DollarPay {}

class WeChatPaySDK {}

class ALiPaySDK {}

class CreditCardPaySDK {}
```

其实这些支付方式可以大致分为两种:现金交易和网银交易,此时可以使用命名空间来区分这两类

```ts
export namespace CashCurrency {
  export class RmbPay {}

  export class DollarPay {}
}

export namespace EBankCurrency {
  export class WeChatPaySDK {}

  export class ALiPaySDK {}

  export class CreditCardPaySDK {}
}
```

:::warning
注意: 这里的代码是在 `.ts` 文件中的,此时它是具有实际逻辑意义的,不能和类型混作一谈
:::
命名空间的使用类似于枚举

```ts
import { CashCurrency } from './declare'

const rmbPay = new CashCurrency.RmbPay()
```

需要注意的是,命名空间内部实际上就想是一个独立的代码文件,因此内部的变量需要导出后,才能通过链式访问

除此之外,命名空间也可以进行嵌套,这里不过多赘述了

类似于类型声明中的同名接口合并,命名空间也可以进行合并,但需要通过三斜线指令来声明导入

```ts
/// <reference path="./animal.ts"/>
/// <reference path="./dog.ts"/>
/// <reference path="./corgi.ts"/>

Animal.Dog.Corgi.corgiBark()
```

### 仅类型导入

在 `ts` 中,当我们导入一个类型时其实并不需要额外的操作,和导入一个实际值是完全一样的

```ts
export const foo = () => {}
export type Footype = any

import { foo, Footype } from './foo'
```

虽然类型导入和值导入存在同一条导入语句中,在编译后的 `js` 代码中只会有值导入存在,同时在编译的过程中,值与类型所在的内存空间也是分开的

可以更好区分值导入和类型导入,只需要通过 `import type` 语法即可

```ts
import { foo } from './foo'
import type { Footype } from './foo'
```

或者更简便的写法(**4.6**版本后支持)

```ts
import { foo, type Footype } from './foo'
```

引入风格(styles)

- 一般最上面是 `React` / `Vue` 等
- 第三方 `UI` 组件,然后是项目内封装的其他组件
- 第三方工具库,然后是项目内封装的工具方法,具体 `hooks` 和 `utils` 等
- 类型导入,包括第三方的类型导入,项目内的类型导入等
- 样式文件(`CSS-IN-JS` 的情况下放置第二条中)
