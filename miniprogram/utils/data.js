// ============================================
// 所有可编辑的内容都集中在这个文件里
// 改价格、理发师、营业时间、图库，只需改这里
// ============================================

const SHOP = {
  name: '剪约造型',
  slogan: '懂你的发型，更懂你',
  phone: '138-0000-0000',
  address: 'XX市XX区XX路88号',
  hours: '周一至周日 10:00 - 21:00',
  closed: '每周二店休',
};

const barbers = [
  {
    id: 1,
    name: '阿杰',
    title: '首席发型师',
    years: 8,
    tags: ['剪发', '造型', '男士油头'],
    priceFrom: 88,
    desc: '擅长日系剪裁与男士油头，注重细节与头型比例。',
  },
  {
    id: 2,
    name: '小林',
    title: '资深发型师',
    years: 5,
    tags: ['染发', '烫发', '韩式'],
    priceFrom: 68,
    desc: '专注韩式烫染，擅长根据肤色推荐发色。',
  },
  {
    id: 3,
    name: 'Kevin',
    title: '造型总监',
    years: 12,
    tags: ['创意染', '修护', '舞台造型'],
    priceFrom: 128,
    desc: '十余年经验，创意染发与受损修护专长。',
  },
];

const services = [
  { name: '剪发（洗剪吹）', price: 68, duration: 40, note: '含洗头与造型' },
  { name: '烫发', price: 388, duration: 120, note: '按发长浮动' },
  { name: '染发', price: 328, duration: 90, note: '含褪色' },
  { name: '深层护理', price: 158, duration: 60, note: '' },
];

const schedule = {
  hours: SHOP.hours,
  closed: SHOP.closed,
  shifts: [
    { name: '阿杰', days: '周一 / 三 / 五 / 六 / 日', time: '10:00 - 20:00' },
    { name: '小林', days: '周一 / 二 / 四 / 六 / 日', time: '11:00 - 21:00' },
    { name: 'Kevin', days: '周三 / 四 / 五 / 六', time: '12:00 - 21:00' },
  ],
};

// image 留空时，页面会显示占位图；接入云开发后填图片 fileID 即可
const gallery = [
  { id: 1, category: '剪发', title: '日系空气短发', image: '' },
  { id: 2, category: '染发', title: '奶茶灰棕', image: '' },
  { id: 3, category: '造型', title: '男士油头', image: '' },
  { id: 4, category: '剪发', title: '锁骨层次剪', image: '' },
  { id: 5, category: '染发', title: '雾感冷棕', image: '' },
  { id: 6, category: '造型', title: '韩式卷发', image: '' },
];

module.exports = {
  SHOP,
  barbers,
  services,
  schedule,
  gallery,
};
