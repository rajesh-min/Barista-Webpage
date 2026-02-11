import { db, createId } from '../repositories/db.js';

export function createOrder({ bookingId, amount, method = 'CARD' }) {
  const payment = {
    id: createId('PAY'),
    booking_id: bookingId,
    amount,
    payment_method: method,
    payment_status: 'CREATED',
    transaction_id: createId('TXN')
  };
  db.payments.push(payment);
  return payment;
}

export function verifyOrder({ transactionId }) {
  const payment = db.payments.find((item) => item.transaction_id === transactionId);
  if (!payment) {
    return null;
  }

  payment.payment_status = 'SUCCESS';
  return payment;
}
