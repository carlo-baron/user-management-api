import express from 'express';
import {
    getAllUsers,
    getUser,
    updateName,
    deleteUser,
} from '#root/controllers/userController.js';
import {
    checkPermission,
    checkOwnership,
} from '#root/middlewares/authorization/authorize.js';

export const router = express.Router();

router.get(
    '/', 
    checkPermission('read')
    , getAllUsers
);

router.get(
    '/:name', 
    checkPermission('read'),
    getUser
);

router.put(
    '/:name',
    checkPermission('update'),
    checkOwnership,
    updateName
);

router.delete(
    '/:name',
    checkPermission('delete'),
    checkOwnership,
    deleteUser
);
