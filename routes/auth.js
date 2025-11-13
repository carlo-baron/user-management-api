import express from 'express';
import { 
    login,
    refresh,
    register,
    logout
} from '#root/controllers/authController.js';
import authenticate from '#root/middlewares/authenticate.js';

export const router = express.Router();

router.post('/refresh', authenticate, refresh);
router.post('/login', login);
router.post('/register', register);
router.post('/logout', authenticate, logout);

