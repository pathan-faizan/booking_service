const asyncHandler =require('express-async-handler');
const User = require('../../models/userModel');
const SeatPrice = require('../../models/seatPriceModel');
const SeatIdentifier = require('../../models/seatIdentifierModel');
const SeatBook = require('../../models/seatBookModel');
const sequelize = require('../../config/db');
const checkPrice = require('../../utils/countPrice');
const sendMessage = require('../../utils/sendMessage');

const bookSeat = asyncHandler(async(req,res)=>{
    let {name,phone,email,seatIds} = req.body;
    if(!name || !phone || !seatIds || seatIds.length==0){
        res.status(400);
        throw new Error('All fields are required');
    }
    // const [user, created] = await User.findOrCreate({
    //     where: { phone: phone },
    //     defaults: {
    //       name: name,
    //       email: email,
    //       phone: phone,
    //     }
    //   });
     const user = await User.findOne({
        where: { phone: phone },
        });
      if(user){
        return res.status(400).json({
            status:"fail",
            message:"User already exist"
        })
      }  
    
        const createUser = await User.create({
            name: name,
            email: email,
            phone: phone,
            total_price: 0.0,
          });
    
    let TotalPrice = 0;  
    let no_seatBook = [];
    for (let i = 0; i < seatIds.length; i++) {
        const seatId = seatIds[i];
        const seat = await SeatIdentifier.findOne({
            where: {id:seatId},
            include: [{
                model: SeatBook,
                attributes: ['id'],
            }]
        });
        if(seat.seat_book){
            res.status(400);
            createUser.destroy();
            throw new Error('Seat already booked');
        }
        if(seat){
          const seatDetail = await SeatPrice.findOne({
            where: {seat_class:seat.seat_class},
          });  
          let price = await checkPrice(seatDetail);
          console.log(price);
          price = Number(price.replace(/[^0-9.-]+/g,""));

          let seatBookCreate = await SeatBook.create({ 
            seatIdentifierId: seatId,
            userId: createUser.id,
            price: price
           })
        TotalPrice += price; 
        no_seatBook.push(seatBookCreate);

        }
        else{
            res.status(400);
            createUser.destroy();
            throw new Error('Seat not found');
        }
    }  
    createUser.total_price = TotalPrice;
    let checkMessage = await sendMessage(phone,TotalPrice); 
    if(checkMessage){
    await createUser.save();
    res.status(200).json({
        status:"success",
        user: createUser,        
        no_seatBook
    })
    }

})

const retrieveBooking = asyncHandler(async(req,res)=>{
    let {userIdentifier} = req.query;
    if(!userIdentifier){
        res.status(400);
        throw new Error('All fields are required');
    }
    const userDetail = await User.findOne({
        where: { phone: userIdentifier },
        include: [{
          model: SeatBook,
          attributes: ['id', 'price','seatIdentifierId'],
        }],
        attributes: ['id', 'name', 'email', 'phone','total_price'],

      });
      
    if(userDetail){
        res.status(200).json({
            status:"success",
            userDetail
        })
    }
    else{
        res.status(400);
        throw new Error('User not found');
    }
})

module.exports = {bookSeat,retrieveBooking};
