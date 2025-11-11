import express from 'express';
import {
    getAllUsers,
    getUser,
    updateName,
    deleteUser,
} from '#root/controllers/userController.js';
import {
    checkPermission,
} from '#root/middlewares/authorization/authorize.js';

const isUser = (req, res, next) => {
    const { name } = req.params;
    if(req.user.name !== name){
        const err = new Error("Permission Denied");
        err.status = 403;
        return next(err);
    }
    next();
}

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
    isUser,
    updateName
);

router.delete(
    '/:name',
    checkPermission('delete'),
    isUser,
    deleteUser
);
