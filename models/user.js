'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {
    hooks: {
      beforeCreate: (user, options) => {
        user.username = user.username.toLowerCase();
      }
    }
  });
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};