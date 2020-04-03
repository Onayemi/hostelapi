const { Pool } = require('pg');
const Joi = require('joi');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'light',
    database: 'hostelapi',
    port: '5432'
});

//Get room by ID
const getRooms = async (req, res) => {
    const response = await pool.query('SELECT * FROM rooms');
    res.status(200).json(response.rows);
};

//Get room by ID
const getRoomsById = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
    res.status(200).json(response.rows); 
};


const createRoom = async (req, res) => {
    const { error } = validateRoom(req.body); //result.error
    if(error) return res.status(400).send(error.details[0].message);
    
    const { user_id, room_capacity, room_type, description, unit_price, created_at } = req.body;
    const response = await pool.query('INSERT INTO rooms(user_id, room_capacity, room_type, description, unit_price, created_at) VALUES ($1, $2, $3, $4, $5, $6)', [
        user_id, 
        room_capacity, 
        room_type, 
        description, 
        unit_price, 
        created_at
    ]);
    console.log(response);
    res.json({
        message: 'Room added Successfully!',
        body: {
            room: {user_id, room_capacity, room_type, description, unit_price, created_at}
        }
    })
};

const updateRoom = async (req, res) => {
    const id = req.params.id;
    const { room_capacity, room_type, description, unit_price } = req.body;
    const response = await pool.query('UPDATE rooms SET room_capacity = $1, room_type = $2, description = $3, unit_price = $4  WHERE id = $5', [
        room_capacity, 
        room_type, 
        description, 
        unit_price,
        id
    ]);
    console.log(response);
    res.json(`Room Updated successfully!`);
};

const deleteRoom = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('DELETE FROM rooms WHERE id = $1', [id]);
    console.log(response);
    res.json(`Room ${id} delete successfully!`);
};

function validateRoom(value) {
    const schema = {
        // user_id, room_capacity, room_type, description, unit_price, created_at
        user_id: Joi.string().required(),
        room_capacity: Joi.string().required(),
        room_type: Joi.string().required(),
        description: Joi.string().required(),
        unit_price: Joi.string().required(),
        created_at: Joi.string().required()
    };
    return Joi.validate(value, schema);   
};


module.exports = {
    getRooms,
    getRoomsById,
    createRoom,
    updateRoom,
    deleteRoom
}  