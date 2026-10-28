const fs = require('fs');
const path = require('path');

// 数据就存在这个 JSON 文件里，你可以直接打开查看
const DATA_FILE = path.join(__dirname, 'data.json');

function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readData, writeData };
