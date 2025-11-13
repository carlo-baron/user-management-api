import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    try{
        if(!token){
            const err = new Error("No token provided");
            err.status = 403;
            throw err;
        }

        jwt.verify(token, secret, (err, decoded) => {
            if(err){
                const err = new Error("Invalid or expired token"); 
                err.status = 401;
                next(err);
            }
            req.user = decoded;
            next();
        });
    }catch(err){
        next(err);
    }
}

export default authenticate;
