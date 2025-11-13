import mongoose from 'mongoose'; 
import validator from 'validator'; 
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function(val){
                return val.length >= 3;
            },
            message: 'Name must be 3 letters or more'
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid Email']
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
    tokenVersion: {
        type: Number,
        default: 0
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function (next) {
    const user = this;

    if(user.password.length < 8) return next(new Error("Password must be 8 or more characters"));

    try {
        if (!user.isModified('password')) return next();
        if (validator.isHash(user.password, 'bcrypt')) return next();

        const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
        user.password = hash;
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.login = function(){
    this.isLoggedIn = true;
    return this.save();
}

userSchema.methods.logout = function(){
    this.isLoggedIn = false;
    return this.save();
}

userSchema.methods.incrementTokenVersion = function(){
    this.tokenVersion += 1;
    return this.save();
}

const User = mongoose.model('User', userSchema);
export default User;
