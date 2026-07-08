import { body,validationResult } from "express-validator";



function validateRequest(req,res,next){

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    next();
}




export const validateRegisteruser  = [
    body("email").isEmail().withMessage("Please provide a valid email address"),
   
    body("contact").notEmpty().withMessage("Contact is required")
    .matches(/^[0-9]{10}$/).withMessage("Contact must be 10 digits long"),
   
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
   
    body("fullName").notEmpty().withMessage("Full name is required")
    .length({ min: 3 }).withMessage("Full name must be at least 3 characters long"),
      

    validateRequest
    
]