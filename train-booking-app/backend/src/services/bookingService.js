import { db, createId } from '../repositories/db.js';

function generatePnr() {
  return `PNR${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function createBooking({ userId, trainScheduleId, totalAmount, passengers }) {
  const booking = {
    id: createId('BKG'),
    user_id: userId,
    train_schedule_id: trainScheduleId,
    booking_status: 'CONFIRMED',
    total_amount: totalAmount,
    payment_status: 'PAID',
    pnr_number: generatePnr(),
    created_at: new Date().toISOString()
  };

  db.bookings.push(booking);

  passengers.forEach((passenger) => {
    db.passengers.push({
      id: createId('PSG'),
      booking_id: booking.id,
      name: passenger.name,
      age: passenger.age,
      gender: passenger.gender,
      seat_id: passenger.seat_id || null
    });
  });

  return {
    ...booking,
    passengers: db.passengers.filter((passenger) => passenger.booking_id === booking.id)
  };
}

export function listBookingsByUser(userId) {
  return db.bookings
    .filter((booking) => booking.user_id === userId)
    .map((booking) => ({
      ...booking,
      passengers: db.passengers.filter((passenger) => passenger.booking_id === booking.id)
    }));
}

export function cancelBooking({ bookingId, userId }) {
  const booking = db.bookings.find((item) => item.id === bookingId && item.user_id === userId);
  if (!booking) {
    return null;
  }

  booking.booking_status = 'CANCELLED';
  booking.payment_status = 'REFUND_PENDING';
  return booking;
}

export function lockSeat({ trainScheduleId, seatNumber, userId }) {
  const now = Date.now();
  db.seatLocks = db.seatLocks.filter((item) => item.expires_at > now);

  const alreadyLocked = db.seatLocks.find((item) => item.train_schedule_id === trainScheduleId && item.seat_number === seatNumber);
  if (alreadyLocked) {
    return { success: false, message: 'Seat already locked' };
  }

  const lock = {
    id: createId('LOCK'),
    train_schedule_id: trainScheduleId,
    seat_number: seatNumber,
    user_id: userId,
    expires_at: now + 5 * 60 * 1000
  };

  db.seatLocks.push(lock);
  return { success: true, lock };
}
