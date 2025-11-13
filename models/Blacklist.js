import mongoose from 'mongoose'; 

const blacklistSchema = mongoose.Schema({
    token: {
        type: String,
        expiresAt: Date,
        required: true
    }
});

blacklistSchema.index({expiresAt: 1}, {expiresAfterSeconds: 0});

const Blacklist = mongoose.model("Blacklist", blacklistSchema);
export default Blacklist;
