import express from 'express';
import authController from '../controllers/authController.js';
// import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// routes auth
router.post('/signup', authController.signup);
router.post('/login', authController.login);

export default router;
