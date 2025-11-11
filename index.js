import express from 'express';
import connectDB from './config/db.js';
import helmet from 'helmet';

import {router as userRoutes} from './routes/users.js';
import {router as loginRouter} from './routes/login.js';
import {router as registerRouter} from './routes/register.js';

import routeValidator from './middlewares/routes.js';
import errorHandler from './middlewares/errorHandler.js';
import auth from './middlewares/auth.js';

const app = express();
const port = 3000;

connectDB();
app.use(express.json());
app.use(helmet());
app.disable('x-powered-by');

//routes
app.get('/', (req, res) => res.status(200).json({success: true, message: "A Hello from Me to You"});
app.get('/api/', (req, res) => res.status(200).json({success: true, message: "Hello To You"}));
app.use('/api/users', auth, userRoutes);
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);

app.use(routeValidator);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

