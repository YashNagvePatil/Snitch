import { Router } from "express";
import { validateRegisteruser } from "../validators/auth.validator.js";
import { register } from "../controllers/auth.controller.js";
const router = Router()

router.post("/register", validateRegisteruser,register) 
 

export default router;