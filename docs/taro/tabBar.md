---
# 描述 默认取文章内容的前100个字符
description: 自定义 TabBar
# sticky: 999
# 标签
tag:
  - Taro

outline: [2, 3]
---

# Taro 自定义 TabBar

## 步骤

### 1. 目录结构

> 1. 在 src 目录下创建 custom-tab-bar 文件夹(不能自定义文件名)
> 2. 在此目录下创建 index.tsx 和 index.scss

```md
|-- react-taro-pcerame
|-- .DS_Store
|-- .editorconfig
|-- .eslintrc
|-- .gitignore
|-- .prettierrc.js
|-- README.md
|-- babel.config.js
|-- directoryList.md
|-- package.json
|-- pnpm-lock.yaml
|-- project.config.json
|-- project.private.config.json
|-- project.tt.json
|-- tsconfig.json
|-- .swc
| |-- plugins
| |-- v4
| |-- 200063c2c798457e0f441f309e564fe9e258e1dcb142b8c6a1df1cbb41ae9bd9
|-- config
| |-- dev.js
| |-- index.js
| |-- prod.js
|-- src
| |-- .DS_Store
| |-- app.config.ts
| |-- app.scss
| |-- app.ts
| |-- index.html
| |-- custom-tab-bar // 自定义 tabbar 位置
| | |-- index.scss
| | |-- index.tsx
| |-- pages
| | |-- .DS_Store
| | |-- find
| | | |-- index.config.ts
| | | |-- index.scss
| | | |-- index.tsx
| | |-- home
| | | |-- index.config.ts
| | | |-- index.scss
| | | |-- index.tsx
| | |-- music
| | | |-- index.config.ts
| | | |-- index.scss
| | | |-- index.tsx
| | |-- user
| | |-- index.config.ts
| | |-- index.scss
| | |-- index.tsx
| |-- static
| | |-- .DS_Store
| | |-- images
| | |-- .DS_Store
| | |-- avtar.jpg
| | |-- find.png
| | |-- findSelected.png
| | |-- home.png
| | |-- homeSelected.png
| | |-- music.png
| | |-- musicSelected.png
| | |-- user.png
| | |-- userSelected.png
|-- types
|-- global.d.ts
```

### 2. 配置

```tsx
// * app.config.ts

export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/music/index',
    'pages/find/index',
    'pages/user/index',
  ],
  tabBar: {
    custom: true,
    // 自定义 tabbar 不可删除 list
    list: [
      {
        pagePath: 'pages/home/index',
        iconPath: './static/images/home.png',
        selectedIconPath: './static/images/homeSelected.png',
        text: '首页',
      },
      {
        pagePath: 'pages/music/index',
        iconPath: './static/images/music.png',
        selectedIconPath: './static/images/musicSelected.png',
        text: '音乐',
      },
      {
        pagePath: 'pages/find/index',
        iconPath: './static/images/find.png',
        selectedIconPath: './static/images/findSelected.png',
        text: '发现',
      },
      {
        pagePath: 'pages/user/index',
        iconPath: './static/images/user.png',
        selectedIconPath: './static/images/userSelected.png',
        text: '我的',
      },
    ],
  },
})
```

### 3. tabBar

```tsx
// * custom-tab-bar/index.tsx

import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

class customTabBar extends Component {
  state = {
    selected: 0,
    color: 'rgba(178, 178, 178, 1)',
    selectedColor: 'rgba(68, 68, 68, 1)',
    list: [
      {
        pagePath: 'pages/home/index',
        iconPath: '../static/images/home.png',
        selectedIconPath: '../static/images/homeSelected.png',
        text: '首页',
      },
      {
        pagePath: 'pages/music/index',
        iconPath: '../static/images/music.png',
        selectedIconPath: '../static/images/musicSelected.png',
        text: '音乐',
      },
      {
        text: '',
      },
      {
        pagePath: 'pages/find/index',
        iconPath: '../static/images/find.png',
        selectedIconPath: '../static/images/findSelected.png',
        text: '发现',
      },
      {
        pagePath: 'pages/user/index',
        iconPath: '../static/images/user.png',
        selectedIconPath: '../static/images/userSelected.png',
        text: '我的',
      },
    ],
  }
  switchTab = (item, index) => {
    if (index !== 2) {
      const url = '/' + item.pagePath
      Taro.switchTab({
        url: url,
      })
    } else {
      console.log('打开弹层')
    }
  }
  render() {
    return (
      <View className="bottom-tab">
        {this.state.list.map((item, index) => {
          return index === 2 ? (
            <View
              className="bottom-tab-item"
              onClick={() => this.switchTab(item, index)}
            >
              <View className="bottom-tab-item-circle">王</View>
            </View>
          ) : (
            <View
              className="bottom-tab-item"
              onClick={() => this.switchTab(item, index)}
              data-path={item.pagePath}
              key={item.text}
            >
              <Image
                className="bottom-tab-item-img"
                mode="aspectFill"
                src={
                  this.state.selected === index
                    ? item.selectedIconPath!
                    : item.iconPath!
                }
              />
              <View
                className="bottom-tab-item-text"
                style={{
                  color:
                    this.state.selected === index
                      ? this.state.selectedColor
                      : this.state.color,
                }}
              >
                {item.text}
              </View>
            </View>
          )
        })}
      </View>
    )
  }
}

export default customTabBar
```

```tsx
// * custom-tab-bar/index.scss

.bottom-tab {
  position: fixed;
  display: flex;
  width: 100%;
  height: 100px;
  padding-top: 10px;
  background: #fff;
  box-shadow: 0px 2px 15px rgba(184, 184, 210, 0.5);
  bottom: 0;
  /* 设置 ios 底部安全距离 */
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  &-item {
    vertical-align: super;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-img {
      margin: 0px auto;
      width: 40px;
      height: 40px;
    }
    &-text {
      margin-top: 8px;
      font-size: 28px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 600;
      color: rgba(68, 68, 68, 1);
    }
    &-circle {
      position: absolute;
      top: -50px;
      width: 128px;
      height: 128px;
      line-height: 128px;
      z-index: 1;
      border-radius: 50%;
      font-size: 45px;
      font-weight: bold;
      text-align: center;
      color: #fff;
      background: #fff;
    }
    &-circle::after {
      content: "";
      position: absolute;
      width: 104px;
      height: 104px;
      background: #e0af7d;
      z-index: -1;
      border-radius: 50%;
      top: calc(50% - 52px);
      left: calc(50% - 52px);
    }
  }
}

```

### 4. 切换 tabBar

> 在 tabBar 对应文件中添加如下代码

```tsx
useEffect(() => {
  const currentPage = Taro.getCurrentInstance().page! as any
  if (typeof currentPage.getTabBar === 'function' && currentPage.getTabBar()) {
    currentPage.getTabBar().$taroInstances.setState({
      selected: 4, // selected 对应 custom-tab-bar 中的 list 的下标
    })
  }
})
```

::: tip
其中 tabBar 中的图标如果是本地资源,第一次切换的时候会出现抖动,建议使用 网络资源加载
:::
