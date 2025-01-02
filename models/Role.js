// models/Role.js
// const User = require('./User'); // Предполагаме, че моделът се казва "User.js" и е в същата директория

const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConfig');

const Role = sequelize.define('role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Уверете се, че имената на ролите са уникални
  },
  // Други полета, свързани с ролите, ако е необходимо
});

module.exports = Role;
