import express from 'express';
import connectDB from './config/db.js';
import {router as userRoutes} from './routes/users.js';
import {router as loginRouter} from './routes/login.js';
import routeValidator from './middlewares/routes.js';
import errorHandler from './middlewares/errorHandler.js';
import auth from './middlewares/auth.js';

const app = express();
const port = 3000;

connectDB();
app.use(express.json());

//routes
app.get('/', (req, res) => res.status(200).json({message: "Hello To You"}));
app.use('/users', auth, userRoutes);
app.use('/login', loginRouter);

app.use(routeValidator);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

