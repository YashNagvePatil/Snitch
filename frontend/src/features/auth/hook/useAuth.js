import { setError,setLoading,setUser } from "../state/auth.slice";
import { register,login } from "../service/auth.api";
import { useDispatch } from "react-redux";

 export const useAuth = () => {
   
   const dispatch = useDispatch()
    async function handleRegister({email,contact,password,fullName,role = "seller"}){
      
        const data  = await register({email,contact,password,fullName,role})

        dispatch(setUser(data.user))

        return data.user
    }

    async function handleLogin({email,password}){
  
         dispatch(setLoading(true)); 
         dispatch(setError(null)); 



        const data = await login({email,password})
        dispatch(setUser(data.user))

        return data
    }

    return {handleRegister,handleLogin}
    
 }