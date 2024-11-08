import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import middleware from './middleware/error';
import { Request, Response, NextFunction } from 'express';

// Importing routes dynamically
import * as routes from './routes/index';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:8080' }));


// Function to automatically load routes
const autoRenderRouters = () => {
  Object.values(routes).forEach((route:any) => {
    app.use('/api/v1', route);
  });
};

autoRenderRouters();

// Middleware for handling errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  middleware(err, req, res, next);
});

export default app;
