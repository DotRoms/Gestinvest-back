import express from 'express';
import controllerWrapper from '../middlewares/controller.wrapper.middleware.js';
import dashBoardController from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/', controllerWrapper(dashBoardController.dashboardDetail));

router.get('/modal', controllerWrapper(dashBoardController.openModal));

router.post('/buy', controllerWrapper(dashBoardController.addLine));

router.post('/sell', controllerWrapper(dashBoardController.addLine));

export default router;
