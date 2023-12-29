import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from './../models/user';

interface DecodedToken {
  id: string;
}
declare global {
    namespace Express {
      interface Request {
        user?: IUser;
      }
    }
  }
export async function checkLogin(req: Request, res: Response, next: NextFunction): Promise<void|Response> {
  const token = req.header('token');
  if (!token) {
    return res.status(401).json({ message: "please login" });
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_CODE ?? "TESTAUTH") as DecodedToken;

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "expired token" });
    }

    req.user = user as IUser;
    next();
  } catch (ex: any) {
    console.error('authErr:', ex);
    return res.status(401).json({ message: 'Invalid token. Please log in again.', error: ex.message });
  }
}

export function isAdmin(req: Request, res: Response, next: NextFunction): void|Response {
  const user = req.user as IUser;

  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Only admin users are allowed.' });
  }

  next();
}
