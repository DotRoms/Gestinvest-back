import express from 'express';
import authRouter from './authRouter.js';

const router = express.Router();
router.get('/', (req, res) => res.send('Hello World! GestInvest!'));
router.use('/api/authRouter', authRouter);

export default router;
