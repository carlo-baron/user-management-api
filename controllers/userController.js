import User from '#root/models/User.js';

export const getAllUsers = async(req, res, next) => {
    try{
        const users = await User.find({}).select('name -_id');
        if(users.length === 0){
            const err = new Error("No users found");
            err.status = 404;
            throw err;
        };
        return res.status(200).json({
            success: true,
            message: users
        });
    }catch(err){
        next(err);
    }
}

export const getUser = async(req, res, next) => {
    const param = req.params;
    try{
        const user = await User.findOne({name: param.name});
        if(!user){
            const err = new Error("User not found");
            err.status = 404;
            throw err;
        }
        return res.status(200).json({
            success: true,
            message: "The user's email is: " + user.email 
        });
    }catch(err) {
        next(err)
    };
}

export const updateName = async(req, res, next) => {
    const param = req.params;
    const body = req.body;
    try{
        const user = await User.findOne({name: param.name});
        if(!user) {
            const err = new Error("User not found");
            err.status = 404;
            throw err;
        }
        user.name = body.new_name;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "User name updated"
        });
    }catch(err){
        next(err);
    }
}

export const deleteUser = async(req, res, next) => {
    const param = req.params;
    const body = req.body;
    try{
        const user = await User.findOne({name: param.name});
        if(!user) {
            const err = new Error("User not found");
            err.status = 404;
            throw err;
        }
        user.name = body.new_name;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "User name updated"
        });
    }catch(err){
        next(err);
    }
}
