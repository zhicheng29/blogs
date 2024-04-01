---
description: TitHub actions  与服务器时区不一致
# 标签
tag:
  - Git
tags:
  - Github
categories:
  - Linux

outline: [2, 3]
---

# Github 时区设置

当我们利用 `github actions` 创建 `CICD` 时,由于 `github actions` 系统时间与本地时区不一致,会出现时间不一致的问题
因为国内采用的是 UTC+8

首先需要在 `.github/workflows/main.yml`文件添加时区变量

```yml
# 设置时区
env:
  TZ: Asia/Shanghai
```

再在服务器中设置对应的时区

```shell
# 查询系统时间
1. date
# 修改时区
2. tzselect
  # 选择 Asia
  # 选择国家 China
  # 选择时间 Beijing Time
  # 出现 'Therefore TZ='Asia/Shanghai will be used' 设置成功
  # 确认设置 yes
3. 生效
  # echo "TZ='Asia/Shanghai';export TZ" >> ~/.bash_profile
  # source ~/.bash_profile
  # date
```

:::tip
非当前用户时区修改：

`TZ='Asia/Shanghai'; export TZ`

添加上一行内容到 `/etc/profile`（所有用户生效，需要 `root` 权限）

或者`~/.bash_profile`（当前用户生效）
:::
