import jwt from 'jsonwebtoken';
import User from '#root/models/User.js';

const secret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    try{
        if(!token){
            const err = new Error("No token provided");
            err.status = 403;
            throw err;
        }

        jwt.verify(token, secret, async (err, decoded) => {
            if(err){
                return next(err);
            }

            try{
                const user = await User.findOne({name: decoded.name});
                if(decoded.tokenVersion !== user.tokenVersion){
                    const err = new Error("Invalid or expired token"); 
                    err.status = 401;
                    throw err;
                }

                req.user = decoded;
                next();
            }catch(err){
                next(err);
            }
        });
    }catch(err){
        next(err);
    }
}

export default authenticate;
