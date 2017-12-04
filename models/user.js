'use strict';

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    profileId: DataTypes.INTEGER
  });

  User.associate = function(models) {
    // associations can be defined here
    User.hasOne(models.Profile, {
      foreignKey: "userId"
    });
  };

  return User;
};
