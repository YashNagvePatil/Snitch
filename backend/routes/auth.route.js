import { Router } from "express";
import { validateRegisteruser,validateLoginUser } from "../validators/auth.validator.js";
import { googleCallback, login, register } from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateuser } from "../middlewares/auth.middleware.js";
import { getAllProducts } from "../../frontend/src/features/products/service/product.api.js";
const router = Router()

router.post("/register", validateRegisteruser,register) 

router.post("/login",validateLoginUser,login)
 
router.get("/google",
    passport.authenticate("google",{scope:["profile","email"]}))

router.get('/google/callback',
    passport.authenticate('google',
    {session:false,
    failureRedirect:process.env.NODE_ENV == "development" ?"http://localhost:5173/login" : "/login"}),
    googleCallback
)


/** 
 * @route GET /api/auth/me
 * @description Get the authenticated user's profile 
 * @access private
 * **/ 

router.get("/me",authenticateuser)


export default router