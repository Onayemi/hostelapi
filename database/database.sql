CREATE DATABASE hotelapi; 

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(40),
    lastname VARCHAR(40),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    address TEXT NULL,
    confirmation_code VARCHAR(15) NULL,
    status VARCHAR(40) NULL,
    identification_id VARCHAR(40) NULL,
    type VARCHAR(40) NOT NULL,
    password VARCHAR(100) NULL,
    created_at timestamp default NULL,
    updated_at timestamp default NULL
);

INSERT INTO users(firstname, lastname, email, phone, address, confirmation_code, status, identification_id, type, password, created_at, updated_at) VALUES
    ('onayemi', 'samuel', 'onayemi18@gmail.com', '08061313253', '8 Adebayo Street famous', '20023', '1', '2221', 'admin', 'light', '2020-04-03 11:12:00', '2020-04-03 11:12:00');

CREATE TABLE rooms(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    room_capacity INTEGER,
    room_type VARCHAR(15),
    description TEXT NULL,
    unit_price DECIMAL(8, 2) DEFAULT '0.00',
    created_at timestamp default NULL
);

INSERT INTO rooms(user_id, room_capacity, room_type, description, unit_price, created_at) VALUES
    ('1', '4', '4 Beds', 'A room with 4 beds per each', '1500', '2020-04-03 11:12:00'),
    ('1', '3', '3 Beds', 'A room with 3 beds per each', '2500', '2020-04-03 11:12:00'),
    ('1', '2', '1 big Beds', 'A room with 1 big beds', '6500', '2020-04-03 11:12:00');

CREATE TABLE bookings(
    id SERIAL PRIMARY KEY,
    cust_id INT references users(id),
    room_id INT references rooms(id),
    transaction_id VARCHAR(15) UNIQUE NOT NULL,
    itemname VARCHAR(60),
    check_in DATE NOT NULL DEFAULT CURRENT_DATE,
    check_out DATE NOT NULL DEFAULT CURRENT_DATE,
    no_of_guest INTEGER,
    no_of_night INTEGER,
    room_no VARCHAR(10),
    unit_price DECIMAL(8, 2) DEFAULT '0.00',
    amount DECIMAL(8, 2) DEFAULT '0.00',
    created_at timestamp default NULL
);


