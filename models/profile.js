'use strict';

module.exports = (sequelize, DataTypes) => {

  const Profile = sequelize.define('Profile', {
    birthday: DataTypes.DATE,
    gender: DataTypes.STRING,
    maritalStatus: DataTypes.STRING,
    height: DataTypes.INTEGER,
    bodyType: DataTypes.STRING,
    education: DataTypes.STRING,
    occupation: DataTypes.STRING,
    numChildren: DataTypes.INTEGER,
    about: DataTypes.TEXT,
    talents: DataTypes.TEXT,
    favorites: DataTypes.TEXT,
    incentive: DataTypes.TEXT,
    city: DataTypes.STRING,
    distance: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  });


  Profile.GENDERS = ['male', 'female'];
  Profile.MARITAL_STATUSES = ['single'];
  Profile.BODY_TYPES = ['athletic', 'average', 'slim', 'portly'];


  Profile.associate = function(models) {
    // associations can be defined here
    Profile.hasOne(models.User, {
      foreignKey: "profileId"
    });
  };


  return Profile;
};
