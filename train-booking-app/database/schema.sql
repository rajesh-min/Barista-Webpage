-- PostgreSQL schema for Train Ticket Booking System

CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE stations (
  id UUID PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  code VARCHAR(10) UNIQUE NOT NULL,
  city VARCHAR(120) NOT NULL
);

CREATE TABLE trains (
  id UUID PRIMARY KEY,
  train_number VARCHAR(20) UNIQUE NOT NULL,
  train_name VARCHAR(120) NOT NULL,
  source_station_id UUID NOT NULL REFERENCES stations(id),
  destination_station_id UUID NOT NULL REFERENCES stations(id),
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL
);

CREATE TABLE train_schedule (
  id UUID PRIMARY KEY,
  train_id UUID NOT NULL REFERENCES trains(id),
  journey_date DATE NOT NULL,
  available_seats INTEGER NOT NULL,
  fare NUMERIC(10,2) NOT NULL,
  UNIQUE(train_id, journey_date)
);

CREATE TABLE seats (
  id UUID PRIMARY KEY,
  train_id UUID NOT NULL REFERENCES trains(id),
  coach_number VARCHAR(10) NOT NULL,
  seat_number VARCHAR(10) NOT NULL,
  class_type VARCHAR(20) NOT NULL,
  UNIQUE(train_id, coach_number, seat_number)
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  train_schedule_id UUID NOT NULL REFERENCES train_schedule(id),
  booking_status VARCHAR(30) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  payment_status VARCHAR(30) NOT NULL,
  pnr_number VARCHAR(30) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE passengers (
  id UUID PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id),
  name VARCHAR(120) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(20) NOT NULL,
  seat_id UUID REFERENCES seats(id)
);

CREATE TABLE payments (
  id UUID PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id),
  amount NUMERIC(10,2) NOT NULL,
  payment_method VARCHAR(40) NOT NULL,
  payment_status VARCHAR(30) NOT NULL,
  transaction_id VARCHAR(80) UNIQUE NOT NULL
);
