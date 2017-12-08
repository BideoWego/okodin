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

    User.hasMany(models.View, {
      foreignKey: "viewedId"
    });

    User.belongsToMany(models.User, {
      foreignKey: "viewedId",
      as: "Viewers",
      through: {
        model: models.View,
        unique: false
      }
    });

    User.belongsToMany(models.User, {
      foreignKey: "viewerId",
      as: "Vieweds",
      through: {
        model: models.View,
        unique: false
      }
    });
  };

  return User;
};
