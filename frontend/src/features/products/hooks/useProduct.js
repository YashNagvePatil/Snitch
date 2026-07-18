import {createProduct,getSellerProduct} from "../service/product.api"
import {useDispatch} from "react-redux"
import { setSellerProducts } from "../state/product.slice"

 export const useProduct = () =>{
   
    const dispatch = useDispatch()

    async function handelCreateProduct (formData){
         const data = await createProduct(formData)
         return data.product
    }

    async function handelGetSellerProduct (){

        const data = await getSellerProduct()
        dispatch(setSellerProducts(data.products))
         return data.products
    }

    return {handelCreateProduct,handelGetSellerProduct}
 }