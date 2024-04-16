import express from 'express';
import accountController from '../controllers/accountController.js';

const router = express.Router();

router.get('/user', accountController.getUSer);

export default router;
