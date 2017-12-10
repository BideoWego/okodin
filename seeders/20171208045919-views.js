'use strict';
const { View } = require('../models');
const moment = require('moment');


module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const views = [];
    for (let viewerId = 1; viewerId <= 100; viewerId++) {
      const remainder = viewerId % 2;
      for (let viewedId = 1 + remainder; viewedId <= 100; viewedId += 2) {
        if (viewerId === viewedId) {
          continue;
        }

        const date = moment().subtract(viewerId + viewedId, 'days').toDate();
        views.push({
          viewerId,
          viewedId,
          createdAt: date,
          updatedAt: date
        });
      }
    }
    return queryInterface.bulkInsert('Views', views);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Views', null, {}, Views);
  }
};
