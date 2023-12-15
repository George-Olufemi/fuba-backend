import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import { OkResponse } from './helper';
import mongoSanitize from 'express-mongo-sanitize';

const app: Express = express();

/* Routes */
import AuthRoute from './routes/auth.route';
import AccountRoute from './routes/account.route';

/* Express Middleware */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

/* NoSQL injection middleware */
app.use(mongoSanitize());

app.use('/api/auth', AuthRoute);
app.use('/api/account', AccountRoute);

// Default Route
app.get('/api', (_req: Request, res: Response) => {
  return res.status(200).json(new OkResponse('FUBA backend service'));
});

app.get('/api/health', (_req: Request, res: Response) => {
  return res.status(200).json(new OkResponse('Server is active'));
});

app.get('*', (_req: Request, res: Response) => {
  res.status(404).json({
    status: false,
    error: 'Route not found',
    message: "The provided route can't be located, check request query and try again.",
  });
});

export default app;
