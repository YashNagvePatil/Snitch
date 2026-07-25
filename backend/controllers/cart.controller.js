import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"
  export const  addToCart = async (req,res) =>{

       const {productId,variantId} = req.params

       const product = await productModel.findOne({
        _id:productId,
        "variants._id":variantId
       })

        if(!product){
             res.status(404).json({
                message:"product or variant not found",
                success:false
             })
        }

        const  cart = (await cartModel.findOne({user:req.user._id})) || 
                      (await cartModel.create({user:req.user})
        )

        const isProductAlreadyInCart = cart.itmes.some(itme => itme.product.toString() === productId && itme)


         if (isProductAlreadyInCart){
                    
         }
  }