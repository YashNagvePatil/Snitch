import {createBrowserRouter} from "react-router"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/Login"
import ProductPage from "../features/products/pages/Createproduct"
import ProductViewPage from "../features/products/pages/ProductView"
import SellerDashboard from "../features/products/pages/Dashboard"
import Protected from "../features/auth/components/Protected"
import Home from "../features/products/pages/Home"

export const routes = createBrowserRouter([

    {
        path:"/",
        element:<Home/>
    },
    {
        path:"/register",
        element:<Register/>
    }
    ,
    {
        path:"/login",
        element:<Login />

    }
     ,
      {
        path:"/seller",
        children:[
            {
               path:"/seller/create-product" ,
               element:<Protected> <ProductPage/> </Protected>
           },
           
           {
            path:"/seller/dashboard",
            element: <Protected role="seller">
                       <SellerDashboard/>
                     </Protected>  
           }
    ]

       
      }

    ,
    {
        path:"/productView",
        element:<ProductViewPage/>
    }

    

])