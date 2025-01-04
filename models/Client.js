// models/Client.js

const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConfig');

const Client = sequelize.define("client", {
    name: {
        type: DataTypes.STRING,
      //  allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
       // allowNull: false,
    },
    egn: {
        type: DataTypes.BIGINT,
     //   allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.BIGINT,
//allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
     //   allowNull: false,
    },
},
{
    tableName: 'registered_clients', // Тук променете името на таблицата
    timestamps: false // Деактивиране на timestamps
  } );

  Client.createClient = async function (name, lastName, egn, phoneNumber, email) {
    try {
      const client = await this.create({
        name,
        lastName,
        egn,
        phoneNumber,
        email,
      });
      return client;
    } catch (error) {
      throw error;
    }
  };

module.exports = Client;