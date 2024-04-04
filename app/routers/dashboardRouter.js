import express from 'express';
import dashBoardController from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/:id', dashBoardController.dashboardDetail);

// router.post('/buy', dashBoardController);

// router.post('/sell', dashBoardController);

export default router;
