---
# 描述 默认取文章内容的前100个字符
description: 个人服务器 Nginx 配置及搭建
# 标签
tag:
    - Nginx

date: 2023-10-21 21:12:00
outline: [2, 3]
---

# Nginx 配置及搭建

## SSH 连接云服务器

```shell
# 默认账号连接（root）
# 首次连接没有密钥，会出现提示 Are you sure you want to continue connecting (yes/no/[fingerprint])?
# yes

# 在云服务器上生成密钥

# 登录服务器
ssh root@服务器Ip

# 输入密码即可
```

## 安装 Nginx

### 1. 安装环境

```shell
# 安装PCRE pcre-devel、zlib、gcc（服务器默认有，可不安装）、Open SSL（默认带有，可不安装）

yum install -y pcre pcre-devel

yum install -y zlib zlib-devel

# 可不安装
yum install gcc-c++

# 可不安装(如需ssl安装)
yum install -y openssl openssl-devel
```

### 2. 安装 Nginx

```shell
# 切换至 /usr/local 目录下
cd /usr/local

# 创建 nginx 目录
mkdir nginx

# 切换至 nginx 目录下

# 安装 Nginx（wget）这里使用的是1.20.0版本
wget -c https://nginx.org/download/nginx-1.20.0.tar.gz

# 解压 nginx 压缩包
tar -zxvf nginx-1.20.0.tar.gz
```

### 3. 配置 Nginx

```shell
# 切换至 nginx-1.20.0 目录下
cd nginx-1.20.0

# 配置 nginx
# 如果后期不需要配置 https 服务可直接执行 ./configure
./configure
# 如果需要 https 服务，则需要加上SLL模块
./configure --with-http_ssl_module
# 注意：如果运行 ./configure --with-http_ssl_module 命令时，出现 openssl openssl-devel 模块错误，需要重新安装一下 openssl
```

### 4. 编译安装 Nginx

```shell
# 依次执行一下命令
make
make install
```

### 5. 启动 Nginx

```shell
# 启动
/usr/local/nginx/sbin/nginx
```

### 6. 浏览器查看 Nginx 是否启动

> 在浏览器地址中输入 服务器 IP 即可

## Nginx 常见命令

```shell
# 查看 Nginx 进程
ps aux|grep nginx

# 检查 Nginx 配置文件是否正确
/usr/local/nginx/sbin/nginx -t

# 启动 Nginx
/usr/local/nginx/sbin/nginx

# 重启 Nginx
/usr/local/nginx/sbin/nginx -s reopen

# 重新加载 Nginx 配置文件，然后以优雅的方式重启 Nginx
/usr/local/nginx/sbin/nginx -s reload

# 强制停止 Nginx 服务器
/usr/local/nginx/sbin/nginx -s stop

# 优雅地停止 Nginx 服务器（即处理完所有请求后再停止服务）
/usr/local/nginx/sbin/nginx -s quit

# 从容停止 Nginx 服务器进程
kill -QUIT 主进程号

# 快速停止 Nginx 服务器进程
kill -TERM 主进程号

# 强制停止 Nginx 服务器进程
pkill -9 nginx

# 杀死所有 Nginx 进程
killall nginx


防火墙命令
# 开启防火墙
service firewalld start

# 重启
service firewalld restart

# 关闭防火墙
service firewalld stop

# 查看防火墙规则
firewall-cmd --list-all

# 查询端口是否开放
firewall-cmd --query-port=8080/tcp

# 开放80端口
firewall-cmd --permanent --add-port=80/tcp

# 移除端口
firewall-cmd --permanent --remove-port=8080/tcp

# 重启防火墙（修改配置后要重启防火墙）
firewall-cmd --reload
```
