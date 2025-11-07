import User from '../models/User.js';

export const getAllUsers = async(req, res, next) => {
    try{
        const users = await User.find({}).select('name -_id');
        if(users.length === 0){
            const err = new Error("No users found");
            err.status = 404;
            throw err;
        };
        return res.status(200).json({message: users});
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
        return res.status(200).json({message: "The user's email is: " + user.email });
    }catch(err) {
        next(err)
    };
}

export const createUser = async(req, res, next) => {
    const body = req.body;
    try{
        const newUser = await User.create({
            name: body.name,
            email: body.email,
            password: body.password
        });
        if(!newUser){
            const err = new Error("Failed to create user. Try again");
            err.status = 400;
            throw err;
        }
        return res.status(200).json({message: "Account registered"});
    }catch(err){
        next(err);
    }
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
        return res.status(200).json({message: "User name updated"});
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
        return res.status(200).json({message: "User name updated"});
    }catch(err){
        next(err);
    }
}
