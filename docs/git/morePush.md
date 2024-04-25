---
description: 如何将代码推送至 Github 和 Gitee仓库
# 标签
tag:
    - Git
tags:
    - Github

date: 2023-07-27 15:52:00
outline: [2, 3]
---

# 代码推送多个仓库

## config 配置

```shell
# 无本地git仓库
1. git init
2. git add .
3. git commit -m ''
4. git remote add github github仓库地址
5. git remote add gitee gitee仓库地址
6. git push gitee 分支名
7. git push github 分支名

# 有本地git仓库

# 手动编辑 .git/config 文件
# 将 [remote "分支名(默认是 main )"] 部分替换成以下
[remote "gitee"]
url = 项目地址.git
fetch = +refs/heads/*:refs/remotes/gitee/*
[remote "github"]
url = 项目地址.git
fetch = +refs/heads/*:refs/remotes/github/*

# 推送代码与6,7步一致
```
