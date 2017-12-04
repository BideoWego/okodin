const moment = require('moment');


const DateHelper = {};

DateHelper.age = date => moment().diff(date, 'years');

module.exports = DateHelper;
