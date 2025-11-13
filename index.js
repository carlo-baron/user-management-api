import express from 'express';
import connectDB from './config/db.js';
import helmet from 'helmet';
import cors from 'cors';
import cookieparser from 'cookie-parser';

import {router as userRoutes} from './routes/users.js';
import {router as authRouter} from './routes/auth.js';

import routeValidator from './middlewares/routes.js';
import errorHandler from './middlewares/errorHandler.js';
import authenticate from './middlewares/authenticate.js';

const app = express();
const port = 3000;

await connectDB();
app.use(express.json());
app.use(cookieparser());
app.use(helmet());
app.use(cors());
app.disable('x-powered-by');

//routes
app.get('/', (req, res) => res.status(200).json({success: true, message: "A Hello from Me to You"}));
app.get('/api/', (req, res) => res.status(200).json({success: true, message: "Hello To You"}));
app.use('/api/users', authenticate, userRoutes);
app.use('/api/auth/', authRouter);

app.use(routeValidator);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

