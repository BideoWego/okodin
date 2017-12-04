'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      birthday: {
        type: Sequelize.DATE
      },
      gender: {
        type: Sequelize.STRING
      },
      maritalStatus: {
        type: Sequelize.STRING
      },
      height: {
        type: Sequelize.INTEGER
      },
      bodyType: {
        type: Sequelize.STRING
      },
      education: {
        type: Sequelize.STRING
      },
      occupation: {
        type: Sequelize.STRING
      },
      numChildren: {
        type: Sequelize.INTEGER
      },
      about: {
        type: Sequelize.TEXT
      },
      talents: {
        type: Sequelize.TEXT
      },
      favorites: {
        type: Sequelize.TEXT
      },
      incentive: {
        type: Sequelize.TEXT
      },
      city: {
        type: Sequelize.STRING
      },
      distance: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Profiles');
  }
};
