'use strict';


module.exports = (sequelize, DataTypes) => {

  const Like = sequelize.define('Like', {
    likerId: DataTypes.INTEGER,
    likedId: DataTypes.INTEGER
  });

  Like.associate = function(models) {
    // associations can be defined here
    Like.belongsTo(models.User, {
      foreignKey: "likerId"
    });

    Like.belongsTo(models.User, {
      foreignKey: "likedId"
    });
  };

  return Like;
};