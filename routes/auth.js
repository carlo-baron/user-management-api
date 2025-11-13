import express from 'express';
import { 
    login,
    refresh,
    register,
} from '#root/controllers/authController.js';
import authenticate from '#root/middlewares/authenticate.js';

export const router = express.Router();

router.post('/login', login);
router.use('/refresh', authenticate, refresh);
router.post('/register', register);

