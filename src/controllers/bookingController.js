const { Pool } = require('pg');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
// var crypto = require('crypto');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'light',
    database: 'hostelapi',
    port: '5432'
});

//Create Booking
const createBooking = async (req, res) => {
   
    const { error } = validateBooking(req.body); //result.error
    if(error) return res.status(400).send(error.details[0].message);

    const { firstname, lastname, email, phone, address, type } = req.body;
    const { cust_id, room_id, transaction_id, itemname, check_in, check_out, no_of_guest, no_of_night, room_no, unit_price, amount, created_at } = req.body;
    
    const trans_id = uuidv4();
    console.log(trans_id);
    // check the interval of date
    const timeDiff = (new Date(check_out) - (new Date(check_in)));
    const days = (timeDiff / (1000 * 60 * 24))/60;

    console.log(days);
    // const { cust_id, room_id, transaction_id, itemname, check_in, check_out, no_of_guest, no_of_night, room_no, unit_price, amount, created_at } = req.bookings;
    const customer = await pool.query('INSERT INTO users(firstname, lastname, email, phone, address, type) VALUES ($1, $2, $3, $4, $5, $6) returning *', [
    // const customer = await pool.query('INSERT INTO users(firstname, lastname, email, phone, address, type) VALUES ($1, $2, $3, $4, $5, $6) returning *', [
        firstname, lastname, email, phone, address, type
    ]);
    if(customer){ 
        const getUserId = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);  
        if (getUserId.rows[0].id === undefined) {
            res.status(404).json('Records not found!');
        }
        const uid = getUserId.rows[0].id;
        console.log(uid);

        const response = await pool.query('INSERT INTO bookings(cust_id, room_id, transaction_id, itemname, check_in, check_out, no_of_guest, no_of_night, room_no, unit_price, amount, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning *', [
            uid, room_id, trans_id, itemname, check_in, check_out, no_of_guest, days, room_no, unit_price, amount, created_at
        ]);
        console.log(response);
        // return res.status(200).send('Successfully');
        res.json({
            message: 'Room added Successfully!',
            body: {
                room: {uid, room_id, trans_id, itemname, check_in, check_out, no_of_guest, days, room_no, unit_price, amount, created_at}
            }
        })
    }
};

const fetchBooking = async (req, res) => {
    const response = await pool.query(`SELECT users.firstname, users.lastname, bookings.transaction_id, bookings.itemname, bookings.check_in, bookings.check_out, bookings.no_of_night, bookings.room_no, bookings.unit_price, bookings.amount 
                                    FROM users
                                    JOIN bookings ON users.id = bookings.cust_id`);
                res.status(200).json(response.rows);
};

const fetchBookingById = async (req, res) => {
    const id = parseInt(req.params.id)
    const response = await pool.query(`SELECT users.firstname, users.lastname, bookings.transaction_id, bookings.itemname, bookings.check_in, bookings.check_out, bookings.no_of_night, bookings.room_no, bookings.unit_price, bookings.amount 
                                    FROM users
                                    JOIN bookings ON users.id =  bookings.cust_id
                                    WHERE users.id = $1`, [id]);
            const result = response[0];
            if(!result) {
                // res.status(401).send('Message not found!');
                res.status(401).json({
                    status: 'error',
                    message: 'Record not found!',
                });
            }
            res.status(200).json(response.rows);
};


const updateBooking = async (req, res) => {
    const id = req.params.id;
    const { itemname, check_in, check_out, no_of_guest, no_of_night, room_no, unit_price, amount } = req.body;
    const response = await pool.query('UPDATE bookings SET itemname = $1, check_in = $2, check_out = $3, no_of_guest = $4, no_of_night = $5, room_no = $6, unit_price = $7, amount = $8  WHERE id = $9', [
        itemname, check_in, check_out, no_of_guest, no_of_night, room_no, unit_price, amount, id
    ]);
    console.log(response);
    res.json(`Booking Updated successfully!`);
};

const deleteBooking = async (req, res) => {
    const id = req.params.id;
    const deleteBooking = await pool.query('DELETE FROM bookings WHERE cust_id = $1', [id]);
    if(deleteBooking){
        const deleteCustomer = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        console.log(deleteCustomer);
        res.json(`Booking ${id} delete successfully!`);
    }
};

function validateBooking(value) {
    const schema = {
        room_id: Joi.string().required(),
        firstname: Joi.string().min(3).required(),
        lastname: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().min(7).required(),
        address: Joi.string().required(),
        itemname: Joi.string().required(),
        type: Joi.string().required(),
        room_no: Joi.string().required(),
        unit_price: Joi.string().required(),
        amount: Joi.string().required(),
        check_in: Joi.string().required(),
        check_out: Joi.string().required(),
        no_of_guest: Joi.string().required(),
        created_at: Joi.string().required(),
    };
    return Joi.validate(value, schema);   
};


module.exports = {
    createBooking,
    updateBooking,
    deleteBooking,
    fetchBooking,
    fetchBookingById
}  
