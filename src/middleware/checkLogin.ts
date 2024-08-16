import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from './../models/user';

interface DecodedToken {
  id: string;
}
declare global {
    namespace Express {
      interface Request {
        user?: IUser ;
      }
    }
  }
  export async function checkLogin(req: Request, res: Response, next: NextFunction): Promise<void|Response> {
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader) {
      return res.status(401).json({ message: "Please provide a token." });
    }
  
    const [scheme, token] = authorizationHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: "Invalid authorization header format." });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.AUTH_CODE || "TESTAUTH") as DecodedToken;
  
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "Invalid token. Please log in again." });
      }
  
      req.user = user as IUser;
      next();
    } catch (ex: any) {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
  }

export function isAdmin(req: Request, res: Response, next: NextFunction): void|Response {
  const user = req.user as IUser;
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Only admin users are allowed.' });
  }
  next();
}
