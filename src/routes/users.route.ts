import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  registerUserValidator,
  loginUserValidator,
  updateUserRoleValidator,
} from "../validators/users.validator";
import {
  registerUser,
  confirmEmail,
  loginUser,
  getUserProfile,
  updateUserRole,
} from "../controllers/users.controller";

const router = Router();

router.post("/register", registerUserValidator, registerUser);
router.post("/login", loginUserValidator, loginUser);
router.get("/me", auth.user, getUserProfile);
router.put("/:id/role", updateUserRoleValidator, auth.admin, updateUserRole);
router.get("/confirm-email", confirmEmail);

export default router;
