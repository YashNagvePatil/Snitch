import { Router } from "express";
import { validateRegisteruser } from "../validators/auth.validator.js";

const router = Router()

router.post("/register", validateRegisteruser) 
 

export default router;