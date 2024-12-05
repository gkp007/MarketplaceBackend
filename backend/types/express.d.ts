import { Request } from 'express';
import { User } from '../model/userModel';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface AuthenticatedRequest extends Request {
    user?: User;
  }