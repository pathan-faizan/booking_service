const fs = require("fs");
const { parse } = require("csv-parse");
const SeatPrice = require("../models/seatPriceModel");
const SeatIdentifier = require("../models/seatIdentifierModel");

// inserting in seat_price table
const saveCSVToDB =  () => {
 
let seat_price = [];    
let seat_identifier_list = [];
 fs.createReadStream("./seat_price.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data",function (row) {
    seat_price.push({
        seat_class: row[1],
        min_price: row[2],
        normal_price: row[3],
        max_price: row[4],
    })
   
  })
    .on("end", async function () {
        

          
        fs.createReadStream("./seat_identifier.csv")
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data",async function (row) {
                seat_identifier_list.push({
                    seat_identifier: row[1],
                    seat_class: row[2],
                })

            })
            .on("end", async function () {
              let findCSVdata = SeatPrice.findOne({
                where:{
                  seat_class:seat_price[0].seat_class
                }
              })
              if(!findCSVdata){
                await SeatPrice.bulkCreate(seat_price)
                await SeatIdentifier.bulkCreate(seat_identifier_list)
              }

            });
  })


// inserting in seat_identifier table 



    

};

module.exports = saveCSVToDB;