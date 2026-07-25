import express from "express"
import authenticateUser from "../middlewares/auth.middleware.js"
import { addToCart } from "../controllers/cart.controller.js";
import { validateAddToCart } from "../validators/cart.validator.js";



  const router = express.Router();


   /**
    * @route POST /api/cart/:porductId/:variantId
    * @route ADD item to cart
    * @access Private
    * @argument porductId = Id of the product to add
    * @argument variantId = Id of the variant to add 
    * @argument quantity - quantity of the item to add (optional ,default:1)
    */

router.post("/add/:productId/:variantId",authenticateUser,validateAddToCart,addToCart) 

router.get('/',authenticateUser,)


export default router;