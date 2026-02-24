import { createBrowserRouter, RouterProvider } from "react-router";
// import Home from "../pages/Home"
import Login from "../pages/Login"
import ProductDetails from "../pages/ProductDetails"
import Signup from "../pages/Singup"
import AddProduct from "../admin/AddProduct"
import ProductList from "../admin/ProductList"
import EditProduct from "../admin/EditProduct"
import PublicRoute from "../components/PublicRoute"
import ProtectedRoute from "../components/ProtectedRoute"

const router = createBrowserRouter([
  { path: "/", element:
    <PublicRoute>

    <Signup /> 
    </PublicRoute>
  },
  {
    path: "/login", element:
      <PublicRoute>

        <Login />
      </PublicRoute>
  },
  {
    path: "/signup", element:
      <PublicRoute>

        <Signup />
      </PublicRoute>
  },
  { path: "/products", element: <ProductDetails /> },



  // protected route
  {
    path: "/admin/products", element:
      <ProtectedRoute>

        <AddProduct />
      </ProtectedRoute>
  },
  {
    path: "/admin/product/list", element:
      <ProtectedRoute>

        <ProductList />
      </ProtectedRoute>
  },
  {
    path: "/admin/product/edit/:id", element:
      <ProtectedRoute>

        <EditProduct />
      </ProtectedRoute>
  },
])

export default function App() {
  return <RouterProvider router={router} />
}