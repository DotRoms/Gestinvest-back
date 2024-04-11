import express from 'express';
import controllerWrapper from '../middlewares/controller.wrapper.middleware.js';
import authController from '../controllers/authController.js';

const router = express.Router();

// routes auth
router.post('/signup', controllerWrapper(authController.signup));
router.post('/login', controllerWrapper(authController.login));

export default router;
