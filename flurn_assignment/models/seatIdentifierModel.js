const { DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const SeatPrice = require('./seatPriceModel');

const SeatIdentifier = sequelize.define('seat_identifier', {
    id: {
   type: DataTypes.INTEGER,
   autoIncrement: true,
   primaryKey: true
 },
   seat_identifier: DataTypes.STRING,
   seat_class: {
   type: DataTypes.STRING,
   }

},{timestamps:false});

SeatPrice.hasMany(SeatIdentifier, {foreignKey: 'seat_class', sourceKey: 'seat_class'});


SeatIdentifier.sync().then(() => {
  console.log('seat Identifier table created');
});

module.exports = SeatIdentifier;