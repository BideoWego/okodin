'use strict';
const { Like } = require('../models');
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
    const likes = [];
    for (let likerId = 1; likerId <= 100; likerId++) {
      const remainder = likerId % 2;
      for (let likedId = 1 + remainder; likedId <= 100; likedId += 2) {
        if (likerId === likedId) {
          continue;
        }

        const date = moment().subtract(likerId + likedId, 'days').toDate();
        likes.push({
          likerId,
          likedId,
          createdAt: date,
          updatedAt: date
        });
      }
    }
    return queryInterface.bulkInsert('Likes', likes);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Likes', null, {}, Like);
  }
};
