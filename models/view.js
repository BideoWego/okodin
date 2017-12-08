'use strict';

module.exports = (sequelize, DataTypes) => {

  const View = sequelize.define('View', {
    viewerId: DataTypes.INTEGER,
    viewedId: DataTypes.INTEGER
  });

  View.associate = function(models) {
    // associations can be defined here
    View.belongsTo(models.User, {
      foreignKey: "viewerId"
    });

    View.belongsTo(models.User, {
      foreignKey: "viewedId"
    });
  };

  return View;
};
