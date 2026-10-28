// ===== 后台管理（编辑页）=====
const token = localStorage.getItem('adminToken');
if (!token) {
  window.location.href = '/admin.html';
}

let site = null;
const editor = document.getElementById('editor');

function authHeaders() {
  return { 'Authorization': 'Bearer ' + token };
}

function toLogin() {
  localStorage.removeItem('adminToken');
  window.location.href = '/admin.html';
}

function loadSite() {
  fetch('/api/site')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      site = data;
      renderEditor();
    })
    .catch(function (err) {
      alert('加载数据失败: ' + err.message);
    });
}

document.getElementById('save-btn').addEventListener('click', function () {
  fetch('/api/site', {
    method: 'PUT',
    headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
    body: JSON.stringify(site),
  })
    .then(function (r) {
      return r.json().then(function (d) {
        if (!r.ok) {
          if (r.status === 401) {
            alert('登录已失效，请重新登录');
            toLogin();
            throw new Error('未登录');
          }
          throw new Error(d.error || '保存失败');
        }
        return d;
      });
    })
    .then(function () { alert('已保存'); })
    .catch(function (err) {
      if (err.message !== '未登录') alert(err.message);
    });
});

document.getElementById('logout-btn').addEventListener('click', function () {
  toLogin();
});

// ===== 工具函数 =====
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function section(title) {
  const sec = el('section', 'admin-section');
  sec.appendChild(el('h2', 'admin-section-title', title));
  return sec;
}

function field(container, labelText, get, set) {
  const wrap = el('label', 'field');
  wrap.appendChild(el('span', 'field-label', labelText));
  const input = el('input');
  input.value = get() || '';
  input.addEventListener('input', function () { set(input.value); });
  wrap.appendChild(input);
  container.appendChild(wrap);
  return input;
}

function imageField(container, labelText, get, set) {
  const wrap = el('div', 'field image-field');
  wrap.appendChild(el('span', 'field-label', labelText));

  const preview = el('img', 'preview');
  const input = el('input', 'url-input');
  input.value = get() || '';

  function updatePreview() {
    if (input.value) {
      preview.src = input.value;
      preview.hidden = false;
    } else {
      preview.hidden = true;
    }
  }
  input.addEventListener('input', function () { set(input.value); updatePreview(); });

  const btn = el('button', 'small-btn', '上传');
  const fileInput = el('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.hidden = true;
  btn.addEventListener('click', function () { fileInput.click(); });
  fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fetch('/api/upload', { method: 'POST', headers: authHeaders(), body: fd })
      .then(function (r) {
        if (r.status === 401) {
          alert('登录已失效，请重新登录');
          toLogin();
          throw new Error('未登录');
        }
        return r.json();
      })
      .then(function (data) {
        input.value = data.url;
        set(data.url);
        updatePreview();
      })
      .catch(function (err) {
        if (err.message !== '未登录') alert('上传失败: ' + err.message);
      });
  });

  const row = el('div', 'image-row');
  row.appendChild(preview);
  row.appendChild(input);
  row.appendChild(btn);
  row.appendChild(fileInput);
  wrap.appendChild(row);
  updatePreview();
  container.appendChild(wrap);
  return input;
}

function addBtn(container, text, onClick) {
  const b = el('button', 'add-btn', text);
  b.addEventListener('click', onClick);
  container.appendChild(b);
  return b;
}

// ===== 渲染编辑器 =====
function renderEditor() {
  editor.innerHTML = '';
  renderShop();
  renderServices();
  renderBarbers();
  renderShifts();
  renderGallery();
  renderSlides();
}

function renderShop() {
  const sec = section('门店信息');
  field(sec, '店名', function () { return site.shop.name; }, function (v) { site.shop.name = v; });
  field(sec, '口号', function () { return site.shop.slogan; }, function (v) { site.shop.slogan = v; });
  field(sec, '电话', function () { return site.shop.phone; }, function (v) { site.shop.phone = v; });
  field(sec, '地址', function () { return site.shop.address; }, function (v) { site.shop.address = v; });
  field(sec, '营业时间', function () { return site.shop.hours; }, function (v) { site.shop.hours = v; });
  field(sec, '休息日', function () { return site.shop.closed; }, function (v) { site.shop.closed = v; });
  editor.appendChild(sec);
}

function renderServices() {
  const sec = section('服务项目');
  site.services.forEach(function (s, i) {
    const row = el('div', 'row');
    field(row, '名称', function () { return s.name; }, function (v) { s.name = v; });
    field(row, '价格', function () { return s.price; }, function (v) { s.price = Number(v) || 0; });
    field(row, '备注', function () { return s.note; }, function (v) { s.note = v; });
    const del = el('button', 'del-btn', '删');
    del.addEventListener('click', function () { site.services.splice(i, 1); renderEditor(); });
    row.appendChild(del);
    sec.appendChild(row);
  });
  addBtn(sec, '+ 添加服务', function () {
    site.services.push({ name: '', price: 0, duration: 0, note: '' });
    renderEditor();
  });
  editor.appendChild(sec);
}

function renderBarbers() {
  const sec = section('理发师');
  site.barbers.forEach(function (b, i) {
    const card = el('div', 'sub-card');
    card.appendChild(el('h3', 'sub-title', '理发师 ' + (i + 1)));

    field(card, '姓名', function () { return b.name; }, function (v) { b.name = v; });
    field(card, '头衔', function () { return b.title; }, function (v) { b.title = v; });
    field(card, '经验(年)', function () { return b.years; }, function (v) { b.years = Number(v) || 0; });
    field(card, '起步价', function () { return b.priceFrom; }, function (v) { b.priceFrom = Number(v) || 0; });
    field(card, '电话', function () { return b.phone; }, function (v) { b.phone = v; });
    imageField(card, '本人照片', function () { return b.photo; }, function (v) { b.photo = v; });
    field(card, '标签(逗号分隔)', function () { return b.tags.join(','); }, function (v) { b.tags = v.split(',').map(function (s) { return s.trim(); }).filter(Boolean); });
    field(card, '简介', function () { return b.desc; }, function (v) { b.desc = v; });

    card.appendChild(el('h4', 'sub-sub-title', '价目表'));
    b.priceList.forEach(function (p, pi) {
      const row = el('div', 'row');
      field(row, '项目', function () { return p.name; }, function (v) { p.name = v; });
      field(row, '价格', function () { return p.price; }, function (v) { p.price = Number(v) || 0; });
      const del = el('button', 'del-btn', '删');
      del.addEventListener('click', function () { b.priceList.splice(pi, 1); renderEditor(); });
      row.appendChild(del);
      card.appendChild(row);
    });
    addBtn(card, '+ 添加价目', function () {
      b.priceList.push({ name: '', price: 0 });
      renderEditor();
    });

    card.appendChild(el('h4', 'sub-sub-title', '作品'));
    b.works.forEach(function (w, wi) {
      const row = el('div', 'row works-row');
      imageField(row, '图片', function () { return w.image; }, function (v) { w.image = v; });
      field(row, '标题', function () { return w.title; }, function (v) { w.title = v; });
      const del = el('button', 'del-btn', '删');
      del.addEventListener('click', function () { b.works.splice(wi, 1); renderEditor(); });
      row.appendChild(del);
      card.appendChild(row);
    });
    addBtn(card, '+ 添加作品', function () {
      b.works.push({ image: '', title: '' });
      renderEditor();
    });

    const delBarber = el('button', 'del-btn', '删除该理发师');
    delBarber.addEventListener('click', function () { site.barbers.splice(i, 1); renderEditor(); });
    card.appendChild(delBarber);

    sec.appendChild(card);
  });
  addBtn(sec, '+ 添加理发师', function () {
    site.barbers.push({
      id: Date.now(), name: '', title: '', years: 0, tags: [], priceFrom: 0,
      desc: '', phone: '', photo: '', priceList: [], works: [],
    });
    renderEditor();
  });
  editor.appendChild(sec);
}

function renderShifts() {
  const sec = section('理发师排班');
  site.schedule.shifts.forEach(function (s, i) {
    const row = el('div', 'row');
    field(row, '姓名', function () { return s.name; }, function (v) { s.name = v; });
    field(row, '日期', function () { return s.days; }, function (v) { s.days = v; });
    field(row, '时间', function () { return s.time; }, function (v) { s.time = v; });
    const del = el('button', 'del-btn', '删');
    del.addEventListener('click', function () { site.schedule.shifts.splice(i, 1); renderEditor(); });
    row.appendChild(del);
    sec.appendChild(row);
  });
  addBtn(sec, '+ 添加排班', function () {
    site.schedule.shifts.push({ name: '', days: '', time: '' });
    renderEditor();
  });
  editor.appendChild(sec);
}

function renderGallery() {
  const sec = section('作品图库');
  site.gallery.forEach(function (g, i) {
    const row = el('div', 'row works-row');
    imageField(row, '图片', function () { return g.image; }, function (v) { g.image = v; });
    field(row, '分类', function () { return g.category; }, function (v) { g.category = v; });
    field(row, '标题', function () { return g.title; }, function (v) { g.title = v; });
    const del = el('button', 'del-btn', '删');
    del.addEventListener('click', function () { site.gallery.splice(i, 1); renderEditor(); });
    row.appendChild(del);
    sec.appendChild(row);
  });
  addBtn(sec, '+ 添加图库图片', function () {
    site.gallery.push({ id: Date.now(), category: '', title: '', image: '' });
    renderEditor();
  });
  editor.appendChild(sec);
}

function renderSlides() {
  const sec = section('顶部轮播图');
  site.slides.forEach(function (s, i) {
    const row = el('div', 'row works-row');
    imageField(row, '图片', function () { return s.image; }, function (v) { s.image = v; });
    field(row, '标题', function () { return s.title; }, function (v) { s.title = v; });
    const del = el('button', 'del-btn', '删');
    del.addEventListener('click', function () { site.slides.splice(i, 1); renderEditor(); });
    row.appendChild(del);
    sec.appendChild(row);
  });
  addBtn(sec, '+ 添加轮播图', function () {
    site.slides.push({ image: '', title: '' });
    renderEditor();
  });
  editor.appendChild(sec);
}

loadSite();
