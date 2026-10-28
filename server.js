const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const { readData, writeData } = require('./store');

const app = express();
const PORT = process.env.PORT || 3000;

// 管理员密码：改成你自己的；也可用环境变量 ADMIN_PASSWORD 覆盖
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';

// 图片目录：放在 public/images 里，push 后能随 GitHub Pages 一起上线
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 登录 token（保存在内存里，重启服务器会失效，需重新登录）
let adminToken = null;

app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// 图片上传配置
const storage = multer.diskStorage({
  destination: imagesDir,
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 最大 10MB
});

// 把全角字符转半角、去掉首尾空格，避免中文输入法导致的密码错误
function normalizePassword(s) {
  if (typeof s !== 'string') return '';
  return s
    .replace(/[！-～]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
    })
    .replace(/　/g, ' ')
    .trim();
}

// 登录
app.post('/api/login', function (req, res) {
  const password = req.body && req.body.password;
  if (normalizePassword(password) === ADMIN_PASSWORD) {
    adminToken = crypto.randomBytes(24).toString('hex');
    res.json({ token: adminToken });
  } else {
    res.status(401).json({ error: '密码错误' });
  }
});

// 鉴权中间件
function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  if (adminToken && auth === 'Bearer ' + adminToken) {
    return next();
  }
  res.status(401).json({ error: '未登录' });
}

// 公开：读取全站数据
app.get('/api/site', function (req, res) {
  res.json(readData());
});

// 需登录：保存全站数据
app.put('/api/site', requireAuth, function (req, res) {
  writeData(req.body);
  res.json({ ok: true });
});

// 需登录：上传图片
app.post('/api/upload', requireAuth, upload.single('file'), function (req, res) {
  if (!req.file) {
    return res.status(400).json({ error: '没有收到文件' });
  }
  res.json({ url: 'images/' + req.file.filename });
});

app.listen(PORT, function () {
  console.log('前台页面: http://localhost:' + PORT);
  console.log('后台管理: http://localhost:' + PORT + '/admin.html');
});
