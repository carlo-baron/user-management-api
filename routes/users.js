import express from 'express';
import {
    getAllUsers,
    getUser,
    updateName,
    deleteUser,
} from '#root/controllers/userController.js';

export const router = express.Router();

const checkPermission = (action) =>{
    return (req, res, next) => {
        const user = req.user;
        const role = user.role;

        const permissionMap = {
            admin: ['create', 'read', 'update', 'delete'],
            user: ['read']
        }

        if(permissionMap[role]?.includes(action)){
            next();
        }else{
            next(new Error("Permission Denied"));
        }
    }
}

router.get('/', checkPermission('read'), getAllUsers);

router.get('/:name', checkPermission('read'), getUser);

router.put('/:name', checkPermission('update'), updateName);

router.delete('/:name', checkPermission('delete'), deleteUser);
