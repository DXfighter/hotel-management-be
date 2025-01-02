const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: 'hotel',
  username: 'niki',
  password: '1234',
  host: 'localhost',
  dialect: 'postgres',

  
});


module.exports = sequelize;
