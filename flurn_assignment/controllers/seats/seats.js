const asyncHandler =require('express-async-handler');
const SeatPrice = require('../../models/seatPriceModel');
const SeatIdentifier = require('../../models/seatIdentifierModel');
const SeatBook = require('../../models/seatBookModel');
const sequelize = require('../../config/db');
const checkPrice = require('../../utils/countPrice');

const getAllSeatPrice = asyncHandler(async(req,res)=>{
  let seat =  await SeatPrice.findAll({
    attributes: ['id','seat_class'],  
    include: [{
      model: SeatIdentifier,
      attributes: ['id','seat_identifier',[sequelize.literal('CASE WHEN "seat_identifier.id" != "seat_books.seatIdentifierId" THEN False ELSE True END'), 'is_booked']],
      include: [{
        model: SeatBook,
        attributes: [],
      }],
       }],
       
  });
  if (seat){
    res.status(200).json({
      status:"success",
      seat
    })
  }
  else{
    res.status(400);
    throw new Error('Seat not found');
  }
})

const getSeatDetails = asyncHandler(async(req,res)=>{
  let seatDetail =  await SeatPrice.findOne({
    where: {id:req.params.id},
    attributes: ['id','seat_class','min_price','normal_price','max_price'],
    include: [{
      model: SeatIdentifier,
      attributes:['id','seat_identifier',[sequelize.literal('CASE WHEN "seat_identifier.id" != "seat_books.seatIdentifierId" THEN False ELSE True END'), 'is_booked']],
      include: [{
        model: SeatBook,
        attributes: [],
      }]
    }]
  });
  if (seatDetail){
    let price = await checkPrice(seatDetail);
    delete seatDetail.dataValues.min_price;
    delete seatDetail.dataValues.max_price;
    delete seatDetail.dataValues.normal_price;
    seatDetail.dataValues.price = price;

    res.status(200).json({
      status:"success",
      seatDetail,
    })
  }
  else{
    res.status(400);
    throw new Error('Seat not found');
  }
})



module.exports = {getAllSeatPrice,getSeatDetails}