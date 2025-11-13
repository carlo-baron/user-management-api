import User from '#root/models/User.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { RateLimiterMongo } from 'rate-limiter-flexible';

const maxLoginAttempts = 5;
let rateLimiterMongo;

async function getRateLimiter(){
    const db = await mongoose.connection.db;
    const opts = {
        storeClient: db,
        points: maxLoginAttempts,
        duration: 60 * 60 * 3,
        blockDuration: 60 * 60,
    }
    return new RateLimiterMongo(opts);
}

const secret = process.env.JWT_SECRET;

export const login = async (req, res, next) => {
    rateLimiterMongo = await getRateLimiter();
    const { name, password } = req.body;

    const username = validator.escape(name);

    const rlUser = await rateLimiterMongo.get(username);
    if(rlUser !== null && rlUser.consumedPoints > maxLoginAttempts){
        const err = new Error("Too Many Requests");
        err.status = 429;
        throw err;
    }else{
        try{
            const user = await User.findOne({name: username});
            if(!user){
                const err = new Error("Invalid name or password");
                err.status = 400;
                throw err;
            }

            const isMatch = await user.comparePassword(password);
            if(!isMatch){
                try{
                    await rateLimiterMongo.consume(username);

                    const err = new Error("Invalid name or password");
                    err.status = 400;
                    throw err;
                }catch(err){
                    if(err instanceof Error){
                        throw err;
                    }else{
                        const err = new Error("Too Many Requests");
                        err.status = 429;
                        throw err;
                    }
                }
            }
            
            if(rlUser !== null && rlUser.consumedPoints > 0){
                await rateLimiterMongo.delete(username);
            }

            const accessToken = jwt.sign({ 
                id: user._id,
                name: user.name,
                role: user.role 
            }, secret,{
                expiresIn: '10m'
            });

            const refreshToken = jwt.sign({
                name: user.name,
            }, secret, {
                expiresIn: '1d'
            });

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'None', secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({
                success: true,
                message: "Logged in as: " + username,
                token: accessToken,
            });
        }catch(err){
            next(err);
        }
    }
}
export const refresh = async (req, res, next) => {
    try {
        if (!req.cookies?.jwt) {
            const err = new Error("Permission Denied");
            err.status = 400;
            return next(err);
        }

        const refreshToken = req.cookies.jwt;

        const decoded = jwt.verify(refreshToken, secret);
        const username = decoded.name;

        const user = await User.findOne({ name: username });
        if (!user) {
            const err = new Error("Invalid Credentials");
            err.status = 400;
            return next(err);
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                name: user.name,
                role: user.role,
            },
            secret,
            { expiresIn: "10m" }
        );

        return res.status(200).json({
            success: true,
            message: "Refreshed Token of: " + username,
            token: accessToken,
        });

    } catch (err) {
        return next(err);
    }
};

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
        return res.status(200).json({
            success: true,
            message: "Account registered"
        });
    }catch(err){
        next(err);
    }
}
