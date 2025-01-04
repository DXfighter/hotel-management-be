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
    //  allowNull: false 
  },
  
  middleName:  {
    type: DataTypes.STRING,
    // allowNull: false 
  },

  lastName: { 
    type: DataTypes.STRING,
    // allowNull: false 
  },

  egn: {
    type: DataTypes.BIGINT,
    // allowNull: false
  },
  
  pheneNumber: {
    type: DataTypes.BIGINT,
    // allowNull: false
  },
  
  email: {
    type: DataTypes.STRING,
    // allowNull: false
  },

  startWorkDate: {
    type: DataTypes.DATE,
    // allowNull: false
  },

  accauntStatus: {
    type: DataTypes.BOOLEAN,
    // allowNull: false
  },

  endWorkDate: {
    type: DataTypes.DATE,
    allowNull: true
  },

  role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
},
 {
    tableName: 'registered_users' ,
    timestamps: false 
  });
  
  

User.createUser = async function (username, password, name, middleName, lastName, egn, pheneNumber, email, startWorkDate, accauntStatus, role) {
  try {
    const user = await this.create({
      username,
      password,
      name,
      middleName,
      lastName, 
      egn,
      pheneNumber,
      email,
      startWorkDate,
      accauntStatus,
      role
    });
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = User;

