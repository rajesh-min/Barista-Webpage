import { Router } from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/create-order', requireAuth, paymentController.createOrder);
router.post('/verify', requireAuth, paymentController.verifyOrder);

export default router;
