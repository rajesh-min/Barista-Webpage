import * as paymentService from '../services/paymentService.js';

export function createOrder(req, res) {
  const order = paymentService.createOrder(req.body);
  return res.status(201).json(order);
}

export function verifyOrder(req, res) {
  const payment = paymentService.verifyOrder(req.body);
  if (!payment) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  return res.json(payment);
}
