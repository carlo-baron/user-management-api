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
