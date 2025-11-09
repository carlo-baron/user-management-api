import permissionMap from "./roles.js";

export const checkPermission = (action) =>{
    return (req, res, next) => {
        const user = req.user;
        const role = user.role;

        if(permissionMap[role]?.includes(action)){
            next();
        }else{
            next(new Error("Permission Denied"));
        }
    }
}

export const checkOwnership = (req, res, next) => {
    const { name } = req.params;
    if(req.user.name !== name){
        const err = new Error("Permission Denied");
        err.status = 403;
        return next(err);
    }
    next();
}
