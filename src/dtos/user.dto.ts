import { IUser } from "../types";

const ROLES: { [key: number]: string }  = {
    0: "user",
    1: "admin",
};

export default function getUserDTO(user: IUser) {
  return {
    username: user.username,
    email: user.email,
    id: user._id,
    role: ROLES[user.role],
  };
}
