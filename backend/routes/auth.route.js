import { Router } from "express";
import { validateRegisteruser,validateLoginUser } from "../validators/auth.validator.js";
import { login, register } from "../controllers/auth.controller.js";
const router = Router()

router.post("/register", validateRegisteruser,register) 

router.post("/login",validateLoginUser,login)
 

export default router;