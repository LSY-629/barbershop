# 理发店网站

一个理发店展示网站,包含:前台展示页、后台管理(登录 + 可视化编辑)、微信小程序版本。

线上展示用 **GitHub Pages** 部署(静态);本地可运行 Node.js 后端进行后台编辑。

## 技术栈

- 前台:HTML + CSS + 原生 JS(读 `public/data.json` 静态数据)
- 后端:Node.js + Express + Multer(仅本地后台编辑/上传用)
- 数据:单文件 `public/data.json`(JSON,无数据库)

## 目录结构

```
├── server.js              后端入口(登录/鉴权/上传/读写数据)
├── store.js               读写 public/data.json
├── .github/workflows/      GitHub Pages 自动部署脚本
├── public/                网站前台 + 后台管理(线上部署的就是这个目录)
│   ├── index.html         前台页面
│   ├── data.json          站点数据(店名、服务、理发师、排班、图库、轮播)
│   ├── images/            示例图片
│   ├── admin.html         后台登录页
│   ├── manage.html        后台编辑页
│   └── ...
├── miniprogram/           微信小程序版本(静态数据)
└── uploads/               后台上传的图片(运行时自动生成,已忽略)
```

## 本地运行

```bash
npm install     # 首次安装依赖
npm start       # 或 node server.js
```

启动后:

- 前台页面:http://localhost:3000
- 后台管理:http://localhost:3000/admin.html(默认密码 `123456`)

## 线上部署(GitHub Pages)

代码 push 到 GitHub 的 `main` 分支后,`.github/workflows/deploy.yml` 会自动把 `public/` 目录部署到 GitHub Pages。

只需在 GitHub 仓库里开启一次:

> 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**,保存即可。

部署成功后访问:`https://你的用户名.github.io/barbershop/`

## 修改内容

所有展示内容都在 **`public/data.json`** 里,改完保存后 push 即可生效(线上约 1 分钟更新)。

两种改法任选:

1. 直接编辑 `public/data.json` 文件;
2. 本地 `npm start` 后打开后台 `http://localhost:3000/admin.html`,在网页里改并保存(会写入 `public/data.json`),再 push。

> 注意:GitHub Pages 是静态托管,后台登录/上传图片只在本地 `npm start` 时可用,线上不可用。

## 修改管理密码

两种方式任选其一:

1. 改 `server.js` 里的 `ADMIN_PASSWORD` 默认值;
2. 启动时用环境变量覆盖:`ADMIN_PASSWORD=你的密码 npm start`。

> 注意:不要把真实密码提交到仓库,建议用环境变量。
