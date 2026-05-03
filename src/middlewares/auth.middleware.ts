import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { User } from "../types/user";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("Auth middleware called");
  console.log("Cookies:", req.cookies);
  console.log("Token:", req.cookies?.token);
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    req.user = decoded as User;    
    next();
  } catch (err) {
    return res.redirect("/login");
  }
};