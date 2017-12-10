'use strict';

module.exports = (sequelize, DataTypes) => {

  const { Sequelize: { Op } } = sequelize;


  // ----------------------------------------
  // Model
  // ----------------------------------------
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    profileId: DataTypes.INTEGER
  });


  // ----------------------------------------
  // Associations
  // ----------------------------------------
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


  // ----------------------------------------
  // Instance Methods
  // ----------------------------------------
  User.prototype.mutualLikers = async function() {
    return await User.mutualLikers(this);
  };


  // ----------------------------------------
  // Class Methods
  // ----------------------------------------
  User.mutualLikers = async function(user) {
    const id = user.id;
    const {
      Like,
      Profile
    } = sequelize.models;

    const likedIds = await Like.findAll({
      where: { likerId: id },
      attributes: ['likedId'],
      raw: true
    }).map(l => l.likedId);

    const likerIds = await Like.findAll({
      where: {
        likedId: id,
        likerId: { [Op.in]: likedIds },
      },
      attributes: ['likerId'],
      raw: true
    }).map(l => l.likerId);

    return await User.findAll({
      where: { id: { [Op.in]: likerIds } },
      include: [{
        model: Like,
        where: { likerId: id }
      }, {
        model: Profile
      }],
      order: [
        [Like, "createdAt", "DESC"]
      ]
    });
  };


  return User;
};
