import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import config from "../config";
import getUserDTO from "../dtos/user.dto";
import { IUser } from "../types";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password,role } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }
    const emailConfirmationToken = jwt.sign({ email }, config.jwtSecret, { expiresIn: '1h' });
    const userData = { username, email, password, role, emailConfirmationToken };
    const user = new User(userData);
    await user.save();

    const confirmationUrl = `http://${config.host}:${config.port}/users/confirm-email?token=${emailConfirmationToken}`;
    await transporter.sendMail({
      to: email,
      subject: 'Email Confirmation',
      html: `Please confirm your email by clicking the following link: <a href="${confirmationUrl}">Confirm Email</a>`,
    });

    res.status(201).json(getUserDTO(user));
  } catch (error) {
    next(error);
  }
};

export const confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token as string, config.jwtSecret) as { email: string };
    const user = await User.findOneAndUpdate(
      { email: decoded.email, emailConfirmationToken: token },
      { isEmailConfirmed: true, emailConfirmationToken: null },
      { new: true }
    );
    if (!user) return res.status(400).json({ error: "Invalid token" });
    res.json({ message: "Email confirmed successfully" });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.isEmailConfirmed) {
      return res.status(401).json({errors: 'Need to confirm tour email'})
    }
    const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?.id);
    res.json(getUserDTO(user as IUser));
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(getUserDTO(user));
  } catch (error) {
    next(error);
  }
};
