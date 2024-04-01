---
description: Github 构建CI/CD自动部署
# 标签
tag:
  - CICD
tags:
  - Github
categories:
  - Nginx

outline: [2, 3]
---

# CICD 自动部署

> 这里以 github 为例

## 密钥配置

### 1. 服务器配置

```shell
# 需要生成一对密钥(公钥和私钥),公钥放在服务器,密钥放在github中,执行CICD时将会用私钥去解析服务器的公钥
# 推荐在服务器生成密钥对
1. ssh root@你的服务器IP
2. cd .ssh/
3. ssh-keygen -m PEM -t rsa -b 4096(如使用本地密钥可忽略此步骤)
4. cat ~/.ssh/id_rsa.pub 复制(如使用本地密钥,需要复制本地的公钥)
5. vim ~/.ssh/authorized_keys 打开 authorized_keys,将公钥粘贴进去
6. cat ~/.ssh/id_rsa 复制(如使用本地密钥,需要复制本地的私钥)
6. 将 id_rsa 私钥放在 github 项目中的 setting / Secrets and variables / Actions 点击 new reponsitory secret 添加三个参数

SSH_PRIVATE_KEY # 私钥
REMOTE_HOST # 服务器的ip地址
REMOTE_USER # 登陆服务器的账户名,一般是写root
```

[`SSH` 生成参考文档](https://github.com/marketplace/actions/ssh-deploy)

### 2. 项目配置(yml)

> 项目根目录下新建 `.github/workflows/main.yml`

```yml
name: Pcerame CI

on:
  push:
    branches: ['main']

  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # 1. 拉取代码
      - uses: actions/checkout@v3
      # 2. 安装pnpm
      - uses: pnpm/action-setup@v2.2.4
        with:
          version: '7.9.0'

      # 3. 安装 依赖
      - name: Install pnpm dependencies
        run: pnpm install

      # 4. 打包
      - name: Run build task
        run: pnpm build:pro

      # 5. 部署
      - name: Deploy to Server
        uses: easingthemes/ssh-deploy@v4.1.8
        with:
          # 登陆的时候的 sshkey 密钥
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          # Remote host 服务器地址（外网IP）
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          # Remote user 用户
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          # Remote port
          SOURCE: ./dist
          # 部署路径
          TARGET: /usr/local/nginx/html/文件夹名称
```
