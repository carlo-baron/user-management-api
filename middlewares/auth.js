import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    const token = req.headers['authorization'];

    try{
        if(!token){
            const err = new Error("No token provided");
            err.status = 403;
            throw err;
        }

        const tokenWithoutBearer = token.split(' ')[1];
        jwt.verify(tokenWithoutBearer, secret, (err, decoded) => {
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

export default auth;
