import { Document } from "mongoose";

export interface IBook extends Document  {
  title: string;
  author: string;
  publicationDate: Date;
  genres: string[];
}

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  role: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isEmailConfirmed: boolean;
  emailConfirmationToken?: string;
}


export interface IJwtPayload {
  id: string;
  role: number;
}


export interface IError extends Error {
  message: string;
}
