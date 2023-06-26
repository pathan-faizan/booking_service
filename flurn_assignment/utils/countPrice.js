const SeatIdentifier = require('../models/seatIdentifierModel');
const SeatBook = require('../models/seatBookModel');


const checkPrice = async (seatDetail) => {
    const {count, rows } = await SeatIdentifier.findAndCountAll({
        where: {
         seat_class: seatDetail.seat_class,
        },
      });
      let totalCount = count;
      let bookedCount = 0;
      rows.forEach(async(row)=>{
      let booked = await SeatBook.findOne({
        where: {seatIdentifierId:row.dataValues.id},
      });     
      if(booked){
        bookedCount++;
      }       
    })
      let percentage = (bookedCount/totalCount)*100;
      let price = 0;
      if(percentage<40){
        if (seatDetail.min_price){
          price = seatDetail.min_price;
        }
        else{
          price = seatDetail.normal_price;
        }
      }
      if(percentage>40 && percentage<60){
        if (seatDetail.normal_price){
          price = seatDetail.normal_price;
        }
        else{
          price = seatDetail.max_price;
        }
      }
      else{
        if (seatDetail.max_price){
          price = seatDetail.max_price;
        }
        else{
          price = seatDetail.normal_price;
        }
      }
      return price;
};

module.exports = checkPrice;