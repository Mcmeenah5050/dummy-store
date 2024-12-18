import { Router } from "express";
import {
  signUp,
  signIn,
  authenticateUser,
  sendVerifyEmail,
  verifyEmail,
  logout,
  updateUser,
  
} from "../controllers/auth.js";
import { verifyAuth, Roles } from "../middlewares/verifyAuth.js";

const router = Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/sendVerifyMail/:id", sendVerifyEmail);
router.post("/logout", logout);

//get
router.get("/user", verifyAuth(Roles.All), authenticateUser);

router.patch("/verifyMail/:userId/:verificationToken", verifyEmail);

router.patch("/updateuser", verifyAuth(Roles.All), updateUser);

export default router;
