import User from '#root/models/User.js';

export const register = async(req, res, next) => {
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
