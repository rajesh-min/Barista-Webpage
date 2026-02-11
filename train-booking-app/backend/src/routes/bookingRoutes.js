import { Router } from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/seat-lock', requireAuth, bookingController.lockSeat);
router.post('/', requireAuth, bookingController.createBooking);
router.get('/me', requireAuth, bookingController.myBookings);
router.delete('/:id', requireAuth, bookingController.cancelBooking);

export default router;
