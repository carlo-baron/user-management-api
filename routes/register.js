import express from 'express';
import { register } from '#root/controllers/registerController.js';

export const router = express.Router();

router.post('/', register);

