import express from 'express';
import {
    getAllUsers,
    getUser,
    updateName,
    deleteUser,
} from '#root/controllers/userController.js';

export const router = express.Router();

router.get('/', getAllUsers);

router.get('/:name', getUser);

router.put('/:name', updateName);

router.delete('/:name', deleteUser);
