'use strict';
const { Profile } = require('../models');
const _ = require('lodash');


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

    const profiles = [];
    for (let userId = 1; userId <= 100; userId++) {
      profiles.push({
        birthday: new Date(
          1978 + Math.floor(Math.random() * 20),
          Math.floor(Math.random() * 12),
          1
        ),
        gender: Profile.GENDERS[userId % Profile.GENDERS.length],
        maritalStatus: Profile.MARITAL_STATUSES[userId % Profile.MARITAL_STATUSES.length],
        height: 60 + Math.floor(Math.random() * 16),
        bodyType: Profile.BODY_TYPES[userId % Profile.BODY_TYPES.length],
        education: 'School',
        occupation: 'Job',
        numChildren: Math.floor(Math.random() * userId),
        about: "I'm awesome",
        talents: "I'm good at all the things",
        favorites: "I love lamp",
        incentive: "Puppies, kittens and I fart lightening bolts!",
        city: "Asgard",
        distance: Math.floor(Math.random() * userId),
        userId
      });
    }
    return queryInterface.bulkInsert('Profiles', profiles);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Profiles', null, {}, Profile);
  }
};
