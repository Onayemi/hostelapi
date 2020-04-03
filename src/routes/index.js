const { Router } = require('express');
const router = Router();


const { createBooking, fetchBooking, fetchBookingById, updateBooking, deleteBooking  } = require('../controllers/bookingcontroller')
const { getRooms, getRoomsById, createRoom, updateRoom, deleteRoom } = require('../controllers/roomcontroller')

//Booking Room api
router.post('/create/booking', createBooking);
router.get('/view/booking', fetchBooking);
router.get('/view/booking/:id', fetchBookingById);
router.put('/update/booking/:id', updateBooking);
router.delete('/delete/booking/:id', deleteBooking);

// Managing Room api
router.get('/manage/rooms', getRooms); 
router.get('/manage/rooms/:id', getRoomsById); 
router.post('/create/room', createRoom); 
router.put('/update/room/:id', updateRoom); 
router.delete('/delete/room/:id', deleteRoom); 
// /api/posts/method/:year/:month
 

module.exports = router;