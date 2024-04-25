---
# 描述 默认取文章内容的前100个字符
description: 将个人前端项目部署到服务器
# 标签
tag:
    - Nginx

date: 2023-10-22 21:43:00
outline: [2, 3]
---

# 前端项目部署到 Nginx

## 打包项目

```shell
pnpm build
```

## 开始部署

### 1.Nginx 配置

新建项目所在文件夹

```shell
# SSH 登录服务器
ssh root@服务器IP

#输入密码

# 创建文件夹 基本上我们是放在 /usr/local/nginx/html 下，这里我们示例放在 demo 下
cd /usr/local/nginx/html
mkdir demo

# 切换至 demo 文件夹下
cd demo

# 创建 dist 文件夹
mkdir dist

# 创建项目配置文件
cd /usr/local/nginx/conf/conf.d
# 创建项目配置文件（其中 demo 最好和项目文件名一致）
touch demo.conf
# 编辑配置文件
vim demo.conf
# 添加以下内容
server {
    # (端口号你自己定义，我以8200开始，你可以8201 8202等等);
    listen  8200;
    server_name  localhost;
    # 这个配置就是你前端代码放在服务器哪里，按照上述操作(/usr/local/nginx/html/demo/dist路径下)
    root  /usr/local/nginx/html/demo/dist;
    # 如果是history路由配置这个
    location / {
      try_files $uri $uri/ /index.html;
    }
 }

# 重启 Nginx 服务器
/usr/local/nginx/sbin/nginx -s reload

# 在云服务器端上配置开通端口号(安全组)
```

### 2.存放项目文件

在本地项目文件根目录下执行

```shell
# demo 可根据自己创的文件夹更换
scp -r ./dist root@服务器IP:/usr/local/nginx/html/demo

# 在服务器上查看是否上传成功
cd /usr/local/nginx/html/demo/dist
ls -a

```
