'use strict';

// const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  const Users = sequelize.define('users', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      required: true,
      validate: {
        len: [1, 30],
      },
    },
    password: {
      type: DataTypes.STRING,
      required: true,
    },
    division: {
      // to jest klasa xdd
      type: DataTypes.STRING,
      required: true,
    },
    role: {
      type: DataTypes.ENUM,
      values: ['user', 'admin'],
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    underscored: true,
  });
  return Users;
};


// hyhyhyhyhyhyhy
// https://nodeontrain.xyz/tuts/secure_password/
// http://www.hamiltonchapman.com/blog/2014/3/25/user-accounts-using-sequelize-and-passport-in-nodejs
// https://coderwall.com/p/1pn7cg/correct-way-to-store-passwords-in-node-js
