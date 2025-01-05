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

  name: { type: DataTypes.STRING,
  },
  
  middleName:  {
    type: DataTypes.STRING,
  },

  lastName: { 
    type: DataTypes.STRING,
  },

  egn: {
    type: DataTypes.STRING,
  },
  
  phoneNumber: {
    type: DataTypes.STRING,
  },
  
  email: {
    type: DataTypes.STRING,
  },

  startWorkDate: {
    type: DataTypes.DATE,
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  endWorkDate: {
    type: DataTypes.DATE,
    allowNull: true
  },

  role: {
      type: DataTypes.ENUM('admin', 'employee'),
      allowNull: true,
    },
},
{
  tableName: 'users' ,
  timestamps: false 
});

User.createUser = async function (username, password, name, middleName, lastName, egn, phoneNumber, email, startWorkDate, isActive, role) {
  try {
    const user = await this.create({
      username,
      password,
      name,
      middleName,
      lastName, 
      egn,
      phoneNumber,
      email,
      startWorkDate,
      isActive,
      role: role ?? 'employee'
    });

    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = User;
