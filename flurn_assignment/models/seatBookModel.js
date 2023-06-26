const { DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const SeatIdentifier = require('./seatIdentifierModel');
const User = require('./userModel');

const SeatBook = sequelize.define('seat_book', {
    id: {
   type: DataTypes.INTEGER,
   autoIncrement: true,
   primaryKey: true
 },
   price: DataTypes.FLOAT,
   seatIdentifierId: {
        type:DataTypes.INTEGER,
        references: {SeatIdentifier, key: 'id'}
    },
    userId: {
        type:DataTypes.INTEGER,
        references: {User, key: 'id'}
    }

},{timestamps:false});

User.hasMany(SeatBook)
SeatIdentifier.hasOne(SeatBook)

SeatBook.sync().then(() => {
  console.log('seat book table created');
});

module.exports = SeatBook;