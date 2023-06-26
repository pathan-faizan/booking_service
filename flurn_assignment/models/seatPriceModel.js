const { DataTypes} = require('sequelize');
const sequelize = require('../config/db');



const SeatPrice = sequelize.define('seat_price', {
    id: {
   type: DataTypes.INTEGER,
   autoIncrement: true,
   primaryKey: true
 },
   seat_class: {
    type:DataTypes.STRING,
    primaryKey:true
  },
   min_price: DataTypes.STRING,
   max_price: DataTypes.STRING,
   normal_price: DataTypes.STRING,

},{timestamps:false});



SeatPrice.sync().then(() => {
  console.log('table created');
});


module.exports = SeatPrice;