import mongoose from 'mongoose';
import validator from 'validator';

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
        validate: [validator.isEmail, 'Invalid Email']
    },
    password: {
        type: String,
        required: true
    },
});

const User = mongoose.model('User', userSchema);

export default User;
