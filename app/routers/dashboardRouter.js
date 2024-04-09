import express from 'express';
import dashBoardController from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/', dashBoardController.dashboardDetail);

router.get('/modal', dashBoardController.openModal);

router.post('/buy', dashBoardController.addLine);

router.post('/sell', dashBoardController.addLine);

export default router;
