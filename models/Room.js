// models/Room.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConfig');

const Room = sequelize.define('Room', {
number: {
    type: DataTypes.BIGINT,
    // allowNull: false
},
    

capacity: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  type: { type: DataTypes.STRING,
    //  allowNull: false 
  },
  
  status:  {
    type: DataTypes.STRING,
    // allowNull: false 
  },

  priceAdult: { 
    type: DataTypes.BIGINT,
    // allowNull: false 
  },

  priceChaild: {
    type: DataTypes.BIGINT,
    // allowNull: false
  },
  


  
},
 {
    tableName: 'rooms' ,
    timestamps: false 
  });
  
  

Room.createRoom = async function (number, capacity, type, status, priceAdult, priceChaild) {
  try {
    const room = await this.create({
      number,
      capacity,
      type,
      status,
      priceAdult,
      priceChaild,
    

    });
    return room;
  } catch (error) {
    throw error;
  }
};

module.exports = Room;


