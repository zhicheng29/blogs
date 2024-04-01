---
# 描述 默认取文章内容的前100个字符
description: Image 引入图片不生效

# 标签
tag:
  - Taro
---

# Taro 无法引入本地图片

> 在项目中引入本地静态图片发现无法引入,这是因为 Taro 不能直接引用本地静态资源,只能通过以模块导入形式或者网络地址或 Base64 的方式进行资源引用

```tsx
<View className="index">
  <Text>首页</Text>
</View>
<Image src="../../static/images/avtar.jpg"></Image>
```

![错误信息](/taro/imgErr.png)

## 解决方式

### 1. 使用 required

```tsx
<Image src={require('../../static/images/avtar.jpg')}></Image>
```

### 2. 使用 import

```tsx
import avtar from "../../static/images/avtar.jpg";
  ...
<Image src={require("../../static/images/avtar.jpg")}></Image>
```
