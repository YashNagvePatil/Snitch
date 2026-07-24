import axios from "axios"

  const  productApiInstance = axios.create({
    baseURL:"/api/products",
    withCredentials:true
  })


  export async function createProduct(formData){
    const response = await productApiInstance.post("/",formData)

    return response.data
  }

  export async function getSellerProduct () {
     const response = await productApiInstance.get("/seller")

     return response.data
  }

  export async function getAllProducts(){

       const response = await productApiInstance.get("/")
        return response.data
       
  }

  export async function getproductById(productId){
        const response = await productApiInstance.get(`/details/${productId}`)
         return response.data
  }

  export async function addProductVariant(productId,newProductVarient){

      const formData = new FormData()

      newProductVarient.images.forEach((image)=>{
        formData.append(`images`,image.file)
      })

      formData.append("stock",newProductVarient.stock)
      formData.append("priceAmount",newProductVarient.price.amount)
      formData.append("attributes",JSON.stringify(newProductVarient.price.amount))

      const response = await  productApiInstance.post(`/${productId}/variants`,formData)

      return response.data
  }