import express from 'express'
import { authenticateSeller } from '../middlewares/auth.middleware.js';
import { createProduct, getAllProducts, getSellerProduts,getProductDetails } from '../controllers/product.controller.js';
import multer from "multer"
import { createProductValidator } from '../validators/product.validator.js';

const upload = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:5 * 1024 * 1024// 5 mb
    }
})


const router = express.Router();

/**
 * @route POST /api/products
 * @description create a new product
 * @access Private (seller only)
 */

router.post("/",authenticateSeller,upload.array('images',7),createProductValidator,createProduct)

/**
 * @route GET /api/products/seller
 * @description Get all products
 * @access private (seller only)
 */

 router.get("/seller",authenticateSeller,getSellerProduts)

/**
 *  @route GET /api/products
 *  @description Get all product 
 *  @access  Publice access
 */

  router.get("/",getAllProducts)

  /**
 * @route GET /api/products/details/:id
 * @description Get product details by ID
 * @access Public
 */

  router.get("/detail/:id",getProductDetails)


export default router