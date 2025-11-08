import User from '#root/models/User.js';
import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;

export const login = async (req, res, next) => {
    const { name, password } = req.body;
    try{
        const user = await User.findOne({name});
        if(!user){
            const err = new Error("Invalid name or password");
            err.status = 400;
            throw err;
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            const err = new Error("Invalid name or password");
            err.status = 400;
            throw err;
        }

        const token = jwt.sign({ 
            id: user._id,
            name: user.name,
            role: user.role 
        }, secret,{
            expiresIn: '24h'
        });

        return res.status(200).json({
            message: "Logged in as: " + name,
            token: token,
        });
    }catch(err){
        next(err);
    }
}
