import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

// routes auth
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/', (req, res) => res.send('Hello World!'));

export default router;
