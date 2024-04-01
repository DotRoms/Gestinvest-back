import express from 'express';
import { login, signup } from '../controllers/authController.js';

const router = express.Router();

// routes auth
router.post('/login', login);
router.post('/signup', signup);

export default router;
