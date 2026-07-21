import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useProduct } from '../hooks/useProduct';

const ProductDetail = () => {

    const {productId} = useParams();
  
    console.log(productId)

    const [product,setProduct] = useState(null)
    const {handleGetproductById}= useProduct()

    async function fetchProductDetails(){
            const data = await handleGetproductById(productId);
            setProduct(data)
    }
    
    
    useEffect(()=>{
           fetchProductDetails()
     },[productId])

   console.log(ProductDetail)
  return (
    <div>ProductDetail</div>
  )
}

export default ProductDetail