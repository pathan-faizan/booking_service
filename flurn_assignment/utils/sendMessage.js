const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendMessage = async (phoneNo,price) => {

let message = await client.messages
  .create({
     body: 'Your ticket is booked and the total price is $'+price+'',
     from: process.env.TWILIO_PHONE_NO,
     to: phoneNo
   })
 if(message){
     return true;
 }
 else{
     return false;
 }
}

module.exports = sendMessage;