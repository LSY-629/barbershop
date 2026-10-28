// 前台渲染逻辑：从后端 /api/site 读取数据，填进页面
function createEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

// ---------- 理发师详情弹窗 ----------
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');

function openBarber(b) {
  modalBody.innerHTML = '';

  const head = createEl('div', 'modal-head');
  head.appendChild(createEl('div', 'modal-avatar', b.name.charAt(0)));
  const headInfo = createEl('div', 'modal-head-info');
  headInfo.appendChild(createEl('div', 'modal-name', b.name + ' · ' + b.title));
  headInfo.appendChild(createEl('div', 'modal-years', b.years + '年经验'));
  head.appendChild(headInfo);
  modalBody.appendChild(head);

  modalBody.appendChild(createEl('div', 'modal-desc', b.desc));

  const phone = createEl('a', 'modal-phone', '📞 电话：' + b.phone);
  phone.href = 'tel:' + b.phone;
  modalBody.appendChild(phone);

  modalBody.appendChild(createEl('div', 'modal-section-title', '价目表'));
  b.priceList.forEach(function (p) {
    const row = createEl('div', 'modal-price-row');
    row.appendChild(createEl('span', null, p.name));
    row.appendChild(createEl('span', 'modal-price', '¥' + p.price));
    modalBody.appendChild(row);
  });

  modalBody.appendChild(createEl('div', 'modal-section-title', '作品'));
  const works = createEl('div', 'modal-works');
  b.works.forEach(function (w) {
    const item = createEl('div', 'modal-work');
    const thumb = createEl('div', 'modal-work-thumb');
    if (w.image) {
      const img = createEl('img');
      img.src = w.image;
      img.alt = w.title || '';
      thumb.appendChild(img);
    } else {
      thumb.appendChild(createEl('div', 'emoji', '💇'));
    }
    item.appendChild(thumb);
    item.appendChild(createEl('div', 'modal-work-title', w.title));
    works.appendChild(item);
  });
  modalBody.appendChild(works);

  modal.classList.add('show');
}

document.getElementById('modal-close').addEventListener('click', function () {
  modal.classList.remove('show');
});
modal.addEventListener('click', function (e) {
  if (e.target === modal) modal.classList.remove('show');
});

// ---------- 主渲染 ----------
function render(site) {
  const shop = site.shop;
  const barbers = site.barbers;
  const services = site.services;
  const schedule = site.schedule;
  const gallery = site.gallery;
  const slides = site.slides;

  // 店铺信息
  document.title = shop.name + ' - ' + shop.slogan;
  document.querySelector('.brand').textContent = shop.name;
  document.querySelector('.hero-name').textContent = shop.name;
  document.querySelector('.hero-slogan').textContent = shop.slogan;
  document.querySelector('.hero-hours').textContent = '🕙 ' + shop.hours;
  document.getElementById('footer-info').textContent =
    shop.name + ' · ' + shop.address + ' · ' + shop.phone;

  // 服务项目
  const serviceList = document.getElementById('service-list');
  services.forEach(function (s) {
    const row = createEl('div', 'service-row');
    const left = createEl('div');
    left.appendChild(createEl('div', 'service-name', s.name));
    if (s.note) left.appendChild(createEl('div', 'service-note', s.note));
    row.appendChild(left);
    row.appendChild(createEl('div', 'service-price', '¥' + s.price));
    serviceList.appendChild(row);
  });

  // 理发师
  const barberList = document.getElementById('barber-list');
  barbers.forEach(function (b) {
    const card = createEl('div', 'barber-card');
    card.appendChild(createEl('div', 'avatar', b.name.charAt(0)));

    const info = createEl('div', 'info');
    const nameRow = createEl('div', 'name-row');
    nameRow.appendChild(createEl('span', 'name', b.name));
    nameRow.appendChild(createEl('span', 'title', b.title));
    info.appendChild(nameRow);

    const tags = createEl('div', 'tags');
    b.tags.forEach(function (t) {
      tags.appendChild(createEl('span', 'tag', t));
    });
    info.appendChild(tags);

    info.appendChild(createEl('div', 'desc', b.desc));
    info.appendChild(createEl('div', 'price', '¥' + b.priceFrom + '起 · ' + b.years + '年经验'));
    card.appendChild(info);
    card.appendChild(createEl('div', 'barber-chevron', '›'));
    card.addEventListener('click', function () {
      openBarber(b);
    });
    barberList.appendChild(card);
  });

  // 营业时间
  const scheduleBox = document.getElementById('schedule-box');
  const hoursCard = createEl('div', 'card');
  hoursCard.appendChild(createEl('div', 'card-title', '营业时间'));
  hoursCard.appendChild(createEl('div', 'hours', shop.hours));
  hoursCard.appendChild(createEl('div', 'closed', shop.closed));
  scheduleBox.appendChild(hoursCard);

  const shiftCard = createEl('div', 'card');
  shiftCard.appendChild(createEl('div', 'card-title', '理发师排班'));
  schedule.shifts.forEach(function (s) {
    const row = createEl('div', 'shift');
    row.appendChild(createEl('div', 'shift-name', s.name));
    const detail = createEl('div', 'shift-detail');
    detail.appendChild(createEl('div', null, s.days));
    detail.appendChild(createEl('div', null, s.time));
    row.appendChild(detail);
    shiftCard.appendChild(row);
  });
  scheduleBox.appendChild(shiftCard);

  const infoCard = createEl('div', 'card');
  infoCard.appendChild(createEl('div', 'card-title', '门店信息'));
  infoCard.appendChild(createEl('div', 'row', '地址：' + shop.address));
  infoCard.appendChild(createEl('div', 'row', '电话：' + shop.phone));
  scheduleBox.appendChild(infoCard);

  // 作品图库
  const galleryCategories = ['全部', '剪发', '染发', '造型'];
  let activeCategory = '全部';
  const tabsBox = document.getElementById('gallery-tabs');
  const grid = document.getElementById('gallery-grid');

  function renderGallery() {
    const list = activeCategory === '全部'
      ? gallery
      : gallery.filter(function (g) { return g.category === activeCategory; });

    grid.innerHTML = '';
    list.forEach(function (g) {
      const card = createEl('div', 'gallery-card');
      const thumb = createEl('div', 'thumb');
      if (g.image) {
        const img = createEl('img');
        img.src = g.image;
        img.alt = g.title;
        thumb.appendChild(img);
      } else {
        thumb.appendChild(createEl('div', 'emoji', '💇'));
        thumb.appendChild(createEl('div', 'cat', g.category));
      }
      card.appendChild(thumb);
      card.appendChild(createEl('div', 'gallery-title', g.title));
      grid.appendChild(card);
    });
  }

  galleryCategories.forEach(function (c) {
    const tab = createEl('div', 'tab' + (c === activeCategory ? ' tab-active' : ''), c);
    tab.addEventListener('click', function () {
      activeCategory = c;
      Array.prototype.forEach.call(tabsBox.children, function (t) {
        t.classList.toggle('tab-active', t.textContent === c);
      });
      renderGallery();
    });
    tabsBox.appendChild(tab);
  });
  renderGallery();

  // 顶部轮播图
  const track = document.getElementById('carousel-track');
  const dotsBox = document.getElementById('carousel-dots');
  let slideIndex = 0;

  function goToSlide(i) {
    slideIndex = i;
    track.style.transform = 'translateX(-' + (i * 100) + '%)';
    Array.prototype.forEach.call(dotsBox.children, function (d, idx) {
      d.classList.toggle('dot-active', idx === i);
    });
  }

  slides.forEach(function (s, i) {
    const slide = createEl('div', 'carousel-slide');
    if (s.image) {
      const img = createEl('img');
      img.src = s.image;
      img.alt = s.title || '';
      slide.appendChild(img);
    } else {
      slide.appendChild(createEl('div', 'slide-emoji', '💇'));
    }
    slide.appendChild(createEl('div', 'slide-caption', s.title || ''));
    track.appendChild(slide);

    const dot = createEl('div', 'dot' + (i === 0 ? ' dot-active' : ''));
    dot.addEventListener('click', function () {
      goToSlide(i);
    });
    dotsBox.appendChild(dot);
  });

  if (slides.length > 1) {
    setInterval(function () {
      goToSlide((slideIndex + 1) % slides.length);
    }, 3500);
  }

  // 手机端手指滑动切换轮播图
  if (slides.length > 1) {
    let touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    });
    track.addEventListener('touchend', function (e) {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) {
          goToSlide((slideIndex + 1) % slides.length);
        } else {
          goToSlide((slideIndex - 1 + slides.length) % slides.length);
        }
      }
    });
  }
}

fetch('data.json')
  .then(function (r) { return r.json(); })
  .then(render)
  .catch(function (err) {
    console.error('加载数据失败', err);
  });
