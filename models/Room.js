// models/Room.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConfig');

const Room = sequelize.define('Room', {
  number: {
    type: DataTypes.BIGINT,
  },

  capacity: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  type: { type: DataTypes.STRING,
  },
  
  isFree:  {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  priceAdult: { 
    type: DataTypes.BIGINT,
  },

  priceChild: {
    type: DataTypes.BIGINT,
  },
},
{
  tableName: 'rooms',
  timestamps: false 
});

Room.createRoom = async function (number, capacity, type, status, priceAdult, priceChild) {
  try {
    const room = await this.create({
      number,
      capacity,
      type,
      isFree: status ?? true,
      priceAdult,
      priceChild
    });

    return room;
  } catch (error) {
    throw error;
  }
};

module.exports = Room;
