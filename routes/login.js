import express from 'express';
import { login } from '#root/controllers/loginController.js';


export const router = express.Router();

router.post('/', login);

