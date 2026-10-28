const { barbers } = require('../../utils/data.js');

Page({
  data: {
    barbers: barbers.map((b) => ({ ...b, initial: b.name.charAt(0) })),
  },
});
