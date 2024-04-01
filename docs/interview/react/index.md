---
# 描述 默认取文章内容的前100个字符
description: React 常见问题

# 标签
tag:
  - React

# 取二三级标题生成目录
outline: [ 1,2 ]
---

# React 常见问题

## 项目搭建

```lua
# 全局安装
npm i -g create-react-app
# 创建 react
create-react-app 项目名称
# 创建 ts + react
create-react-app 项目名称 --template typescript
```

## 类组件的 state

### setState 用法

`React` 项目中的 `UI` 的改变源于 `state` 改变,类组件中的 `setState` 是更新组件,渲染视图的主要方式

```js
setState(obj, callback)
```

- 第一个采参数: 当 `obj` 为一个独享,则为即将合并的 `state` ;如果 `obj` 是一个函数,那么组件的 `state` 和 `props`
  将作为参数,返回值用于合并新的 `state`
- 第二个参数 callback ：callback 为一个函数，函数执行上下文中可以获取当前 setState 更新后的最新 state 的值，可以作为依赖
  state 变化的副作用函数，可以用来做一些基于 DOM 的操作

## 组将通讯与检验
