import {createProduct,getSellerProduct,getAllProducts} from "../service/product.api"
import {useDispatch} from "react-redux"
import { setSellerProducts,setProducts } from "../state/product.slice"

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

  async function handleGetAllProduct () {
        const data = await getAllProducts()
        dispatch(setProducts(data.products))
  }

    return {handelCreateProduct,handelGetSellerProduct,handleGetAllProduct}
 }