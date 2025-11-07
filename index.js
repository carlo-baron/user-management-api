import express from 'express';
import connectDB from './config/db.js';
import {router as userRoutes} from './routes/users.js';

const app = express();
const port = 3000;

connectDB();

app.use(express.json());

app.get('/', (req, res) => res.status(200).json({message: "Hello To You"}));
app.use('/users', userRoutes);

app.use((req, res, next) => {
    if(!req.route){
        const err = new Error("Route not found");
        err.status = 404;
        return next(err);
    }
    next();
});

app.use((err, req, res, next) => {
  console.error(`[${req.method}] ${req.url} → ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

