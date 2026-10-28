const { SHOP, services, gallery } = require('../../utils/data.js');

Page({
  data: {
    shop: SHOP,
    services,
    gallery: gallery.slice(0, 3),
  },
});
