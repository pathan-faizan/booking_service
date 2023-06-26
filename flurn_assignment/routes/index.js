
const express = require("express")
const router = express.Router();
const {bookSeat,retrieveBooking} = require("../controllers/seats/booking")
const {getAllSeatPrice,getSeatDetails} = require("../controllers/seats/seats")

router.get('/booking',retrieveBooking)
router.post('/book',bookSeat)
router.get('/seats',getAllSeatPrice)
router.get('/seats/:id',getSeatDetails)

module.exports = router;
