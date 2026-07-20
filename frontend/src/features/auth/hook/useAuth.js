import { setError,setLoading,setUser } from "../state/auth.slice";
import { register,login,getMe } from "../service/auth.api";
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

    async function handleGetMe(){
  
        try{
             dispatch(setLoading(true))
             const data = await getMe()
             dispatch(setUser(data.user)) 
              console.log(data.user)
        }catch(err){
            console.log(err)       
        }
        finally{
               dispatch(setLoading(false))
        }

       
    }


    return {handleRegister,handleLogin,handleGetMe}
    
 }