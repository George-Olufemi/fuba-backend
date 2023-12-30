import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import { OkResponse } from './helper';
import mongoSanitize from 'express-mongo-sanitize';
dotenv.config();

const app: Express = express();

/* Routes */
import AuthRoute from './routes/auth.route';
import AccountRoute from './routes/account.route';
import CourseRoute from './routes/course.route';

/* Express Middleware */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

/* NoSQL injection middleware */
app.use(mongoSanitize());

app.use('/api/auth', AuthRoute);
app.use('/api/account', AccountRoute);
app.use('/api/course', CourseRoute);

// Default Route
app.get('/api', (_req: Request, res: Response) => {
  return res.status(200).json(new OkResponse('FUBA backend service'));
});

app.get('/api/health', (_req: Request, res: Response) => {
  return res.status(200).json(new OkResponse('Server is active'));
});

app.use('*', (_req: Request, res: Response) => {
  return res
    .status(404)
    .json(new OkResponse('Route not found, check request query and re-try.'));
});

export default app;
