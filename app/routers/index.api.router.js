import express from 'express';
import authRouter from './authRouter.js';
import dashboardRouter from './dashboardRouter.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from the API router!');
});

router.use('/api/auth', authRouter);
router.use('/api/dashboard', dashboardRouter);

export default router;
