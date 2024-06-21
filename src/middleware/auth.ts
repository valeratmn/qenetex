import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { IJwtPayload } from "../types";

declare module "express-serve-static-core" {
  interface Request {
    user?: IJwtPayload;
  }
}

export const auth = {
  user: (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as IJwtPayload;
      req.user = decoded;
      next();
    } catch (error) {
      res.status(400).json({ error: "Invalid token" });
    }
  },
  admin: (req: Request, res: Response, next: NextFunction) => {
    auth.user(req, res, () => {
      if (req.user?.role !== 1)
        return res.status(403).json({ error: "Access denied" });
      next();
    });
  },
};