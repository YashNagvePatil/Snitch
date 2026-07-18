import {createBrowserRouter} from "react-router"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/Login"
import ProductPage from "../features/products/pages/Createproduct"
import ProductViewPage from "../features/products/pages/ProductView"
import SellerDashboard from "../features/products/pages/Dashboard"

export const routes = createBrowserRouter([

    {
        path:"/",
        element:<h1> hello </h1>
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
               element:<ProductPage/>
           },
           
           {
            path:"/seller/dashboard",
            element: <SellerDashboard/>
           }
    ]

       
      }

    ,
    {
        path:"/productView",
        element:<ProductViewPage/>
    }

    

])