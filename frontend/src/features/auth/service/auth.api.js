import axios from 'axios';


const authApiInstance = axios.create({
    baseURL:"http://localhost:3000/api/auth",
    withCredentials: true,

})

 export async function register ({email,password,contact,fullName}) {

    const response = await authApiInstance.post('/register',{
        email,
        contact,
        password,
        fullName,
        isSeller
    })

      return response.data
 }
