import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import BikeEntry from '@pages/BikeEntry'; //Leo
import ShowWorks from '@pages/ShowWorks'; //Leo
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <Error404/>,
    children: [
      {
        path: '/home',
        element: <Home/>
      },
      {
        path: '/users',
        element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <Users />
        </ProtectedRoute>
        ),
    },
    {//leo
      path: '/BikeEntry', // Nueva ruta
      element: (
        <ProtectedRoute allowedRoles={['administrador', 'usuario']}>
          <BikeEntry />
        </ProtectedRoute>
      )
    },//leo
    {//leo
      path: '/ShowWorks',
      element: (
        <ProtectedRoute allowedRoles={['administrador', 'usuario']}>
          <ShowWorks />
        </ProtectedRoute>
      )
    }//leo
    
    ]
  },
  {
    path: '/auth',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)