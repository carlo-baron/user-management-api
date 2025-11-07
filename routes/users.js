import express from 'express';
import {
    getAllUsers,
    getUser,
    createUser,
    updateName,
    deleteUser,
} from '#root/controllers/userController.js';

export const router = express.Router();

router.get('/', getAllUsers);

router.post('/', createUser);

router.get('/:name', getUser);

router.put('/:name', updateName);

router.delete('/:name', deleteUser);
