import { Router } from 'express';
import * as trainController from '../controllers/trainController.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', trainController.searchTrains);
router.get('/:id', trainController.getTrain);
router.post('/', requireAuth, requireAdmin, trainController.addTrain);
router.put('/:id', requireAuth, requireAdmin, trainController.updateTrain);
router.delete('/:id', requireAuth, requireAdmin, trainController.deleteTrain);

export default router;
