import express from 'express';
import controllerWrapper from '../middlewares/controller.wrapper.middleware.js';
import accountController from '../controllers/accountController.js';

const router = express.Router();

router.get('/', controllerWrapper(accountController.getUSer));
router.patch('/update', controllerWrapper(accountController.updateUser));

export default router;
