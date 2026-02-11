import * as bookingService from '../services/bookingService.js';

export function lockSeat(req, res) {
  const result = bookingService.lockSeat({
    trainScheduleId: req.body.trainScheduleId,
    seatNumber: req.body.seatNumber,
    userId: req.user.id
  });

  if (!result.success) {
    return res.status(409).json(result);
  }

  return res.status(201).json(result);
}

export function createBooking(req, res) {
  const booking = bookingService.createBooking({
    userId: req.user.id,
    trainScheduleId: req.body.trainScheduleId,
    totalAmount: req.body.totalAmount,
    passengers: req.body.passengers || []
  });

  return res.status(201).json(booking);
}

export function myBookings(req, res) {
  const bookings = bookingService.listBookingsByUser(req.user.id);
  return res.json(bookings);
}

export function cancelBooking(req, res) {
  const cancelled = bookingService.cancelBooking({ bookingId: req.params.id, userId: req.user.id });
  if (!cancelled) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  return res.json(cancelled);
}
