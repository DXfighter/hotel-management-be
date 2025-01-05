// models/Client.js

const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConfig');

const Client = sequelize.define("client", {
    name: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    isAdult: {
      type: DataTypes.BOOLEAN
    }
},
{
  tableName: 'registered_clients',
  timestamps: false
});

Client.createClient = async function (name, lastName, phoneNumber, email, isAdult) {
  try {
    const client = await this.create({
      name,
      lastName,
      phoneNumber,
      email,
      isAdult
    });

    return client;
  } catch (error) {
    throw error;
  }
};

module.exports = Client;