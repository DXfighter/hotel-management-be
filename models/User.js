// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConfig');

const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
}, {
    tableName: 'registered_users' ,// Име на таблицата
    timestamps: false 
  });
  
  

User.createUser = async function (username, password) {
  try {
    const user = await this.create({
      username,
      password,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = User;

