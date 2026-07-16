import express from 'express'
import { authenticateSeller } from '../middlewares/auth.middleware.js';
import { createProduct } from '../controllers/product.controller.js';

const router = express.Router();


router.post("/",authenticateSeller,createProduct)



export default router