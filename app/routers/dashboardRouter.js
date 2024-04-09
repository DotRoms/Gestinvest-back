import express from 'express';
import dashBoardController from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/user/:uuid', dashBoardController.dashboardDetail);

router.post('/buy', dashBoardController);

router.post('/sell', dashBoardController);

export default router;
