'use strict';

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    profileId: DataTypes.INTEGER
  });

  User.associate = function(models) {
    // associations can be defined here

    // Profile
    User.hasOne(models.Profile, {
      foreignKey: "userId"
    });

    // View
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

    // Like
    User.hasMany(models.Like, {
      foreignKey: "likedId"
    });

    User.belongsToMany(models.User, {
      foreignKey: "likedId",
      as: "Likers",
      through: {
        model: models.Like,
        unique: false
      }
    });

    User.belongsToMany(models.User, {
      foreignKey: "likerId",
      as: "Likeds",
      through: {
        model: models.Like,
        unique: false
      }
    });
  };

  return User;
};
