import User from '#root/models/User.js';
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
    const rlUser = await rateLimiterMongo.get(name);
    if(rlUser !== null && rlUser.consumedPoints > maxLoginAttempts){
        const err = new Error("Too Many Requests");
        err.status = 429;
        throw err;
    }else{
        try{
            const user = await User.findOne({name});
            if(!user){
                const err = new Error("Invalid name or password");
                err.status = 400;
                throw err;
            }

            const isMatch = await user.comparePassword(password);
            if(!isMatch){
                try{
                    await rateLimiterMongo.consume(name);

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
                await rateLimiterMongo.delete(name);
            }

            const token = jwt.sign({ 
                id: user._id,
                name: user.name,
                role: user.role 
            }, secret,{
                expiresIn: '24h'
            });

            return res.status(200).json({
                success: true,
                message: "Logged in as: " + name,
                token: token,
            });
        }catch(err){
            next(err);
        }
    }
}
