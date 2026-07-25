import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"
 
  export const  addToCart = async (req,res) =>{

       const {productId,variantId} = req.params
       const {quantity = 1} = req.body



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

        const isProductAlreadyInCart = cart.itmes.some(itme => itme.product.toString() === productId && itme.variant?.toString() === variantId)
        

         if (isProductAlreadyInCart){
                const  quantityInCart = cart.itmes.find(item => item.product.toString() === productId && item.variant)
                if(quantityInCart + quantity > stock){
                     return res.status(400).json({
                         message:`only ${stock - quantityInCart} itmes left in stock and you already have ${quantityInCart} itmes in your cart`,
                         success:false
                     })
                }

                await cartModel.findOneAndUpdate(
                    {user:req.user._id,"itmes.product":productId,"itmes.variant":variantId},
                    {$inc:{"itmes.$.quantity":quantity}},
                    {new:true}
                )

                return res.status(200).json({
                    message:"cart updated succesfully",
                    success:true
                })
                
         }

         if (quantity > stock ) {
          return res.status (400).json({
               message:`Only ${stock} items left in stock`,
               success:false
          })

          cart.itmes.push({
               product:productId,
               variant:variantId,
               quantity,
               price:product.price
          })
    
          await cart.save()
           
          return res.status(200).json({
               message:"Product added to cart succesfully",
               success
          })
         }
  }

  export const getCart = async (req,res) =>{
       const user = req.user

       let cart = await cartModel.findOne({user:user._id}).populate("itmes.product")

       if ( !cart ){
          cart = await cartModel.create({user:user._id})
       }

       return res.status(200).json({
          message:"cart retrived succesfully",
          success:true,
          data:cart
       })
  }