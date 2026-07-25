import {createSlice} from "@reduxjs/toolkit"

 const cartSlice = createSlice({
   name :"cart",
   initialState:{
      itmes:[],

   },
     reducers:{ 
         setItems:(state,action) =>{
            state.itmes = action.payload;

         },
           addItem :(state,action)=>{
             state.itmes.push(action.payload)
           }
   

           
     }
 })

  export const {setItems,addItem} = cartSlice.actions
  export default cartSlice.reducer