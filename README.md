# 理发店网站

一个理发店展示网站,包含:前台展示页、后台管理(登录 + 可视化编辑)、微信小程序版本。

## 技术栈

- Node.js + Express(后端)
- Multer(图片上传)
- 数据存于 `data.json`(JSON 文件,无数据库)

## 目录结构

```
├── server.js          后端入口(登录/鉴权/上传/读写数据)
├── store.js           读写 data.json
├── data.json          站点数据(店名、服务、理发师、排班、图库、轮播)
├── public/            网站前台 + 后台管理
│   ├── index.html     前台页面
│   ├── admin.html     后台登录页
│   ├── manage.html    后台编辑页
│   └── ...
├── miniprogram/       微信小程序版本(静态数据)
├── images/            示例图片
└── uploads/           后台上传的图片(运行时自动生成)
```

## 运行

```bash
npm install     # 首次安装依赖
npm start       # 或 node server.js
```

启动后:

- 前台页面:http://localhost:3000
- 后台管理:http://localhost:3000/admin.html(默认密码 `123456`)

## 修改管理密码

两种方式任选其一:

1. 改 `server.js` 里的 `ADMIN_PASSWORD` 默认值;
2. 启动时用环境变量覆盖:`ADMIN_PASSWORD=你的密码 npm start`。

> 注意:不要把真实密码提交到仓库,建议用环境变量。
