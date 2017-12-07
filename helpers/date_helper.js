const moment = require('moment');


const DateHelper = {};

DateHelper.age = date => moment().diff(date, 'years');
DateHelper.ago = (n, interval) => moment().subtract(n, interval);

module.exports = DateHelper;
