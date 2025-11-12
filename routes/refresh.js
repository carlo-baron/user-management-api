import express from 'express';
import { refresh } from '#root/controllers/loginController.js';

export const router = express.Router();

router.use('/', refresh);
