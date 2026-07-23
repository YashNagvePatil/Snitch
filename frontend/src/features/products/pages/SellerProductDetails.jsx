import React, { useEffect } from 'react'
import { useProduct } from '../hooks/useProduct'
import { setProducts } from '../state/product.slice';

const SellerProductDetails = () => {
  
  const {handleGetproductById} = useProduct();
  
   async function fetchProductDetails(){
       try{
        const data = await handleGetproductById(productId);

        setProducts(data?.product || data);
       } catch (error){
        console.log("failed to fetch product details",error)
       }
   }  

    useEffect(()=>{
      fetchProductDetails();

    },[productId]);



  return (
    <div>SellerProductDetails</div>
  )
}

export default SellerProductDetails