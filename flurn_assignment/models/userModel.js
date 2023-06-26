const { DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('user', {
    id: {
   type: DataTypes.INTEGER,
   autoIncrement: true,
   primaryKey: true
 },
   name: DataTypes.STRING,
   email: DataTypes.STRING,
   phone: DataTypes.STRING,
   total_price: DataTypes.FLOAT,
},{timestamps:false});


User.sync().then(() => {
  console.log('User table created');
});

module.exports = User;