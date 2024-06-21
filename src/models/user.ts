import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types";

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  email: { type: String, required: true, unique: true },
  role: { type: Number, default: 0 }, // 0 - user, 1 - admin
  isEmailConfirmed: { type: Boolean, default: false },
  emailConfirmationToken: { type: String },
});

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>("User", userSchema);