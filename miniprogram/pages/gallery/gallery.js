const { gallery } = require('../../utils/data.js');

Page({
  data: {
    categories: ['全部', '剪发', '染发', '造型'],
    active: '全部',
    list: gallery,
    all: gallery,
  },

  onTapCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    const list = cat === '全部' ? this.data.all : this.data.all.filter((x) => x.category === cat);
    this.setData({ active: cat, list });
  },
});
