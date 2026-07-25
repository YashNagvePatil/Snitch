import mongoose, { trusted } from "mongoose"
import priceSchema from "./price.schema"


const cartItemSchema = new mongoose.Schema({
         user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true
         },

         itmes:[
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'product',
                    required:true
                },

                variant:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'varient'
                },

                quantity:{
                    type:Number,
                    default: 1 
                },
                price:{
                           type:priceSchema,
                           required:true
                }
            }
         ]
})

 const  cartModel  = mongoose.model('cart',cartItemSchema)

 export default cartModel