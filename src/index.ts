import express, { Express, Request, Response } from 'express';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import { OkResponse } from './helper';

// Routes
import AuthRoute from './routes/auth.route';

dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use('/api/auth', AuthRoute);

// Default Route
app.get('/', (_req: Request, res: Response) => {
  res.status(200);
  return res.json(new OkResponse('FUBA V1.0.0'));
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200);
  return res.json(new OkResponse('Server is active'));
});

app.get('*', (_req: Request, res: Response) => {
  res.status(404);
  return res.json(new OkResponse('Route not found'));
});

export default app;
