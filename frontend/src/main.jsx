import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import BikeEntry from '@pages/BikeEntry'; //Leo
import ShowWorks from '@pages/ShowWorks'; //Leo
import WorkDetails from '@pages/workDetails';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';
import AddMechanic from '@pages/AddMechanic';
import WorkHours from '@pages/WorkHours';
import AddMarca from '@pages/AddMarca';
import Inventario from '@pages/Inventario';
import AddSeller from '@pages/AddSeller';
import CheckInOut from '@pages/CheckInOut';
import MyShifts from './pages/MyShifts';
import Tareas from '@pages/Tareas';
import AddTareas from '@pages/AddTareas'
import AddComentario from '@pages/AddComentario';
import Comentario from '@pages/Comentario';


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

    {
      path: '/add-mechanic',
      element: (
      <ProtectedRoute allowedRoles={['administrador']}>
          <AddMechanic />
      </ProtectedRoute>
      ),
    },
    {
      path: '/add-seller',
      element: (
      <ProtectedRoute allowedRoles={['administrador']}>
          <AddSeller />
      </ProtectedRoute>
      ),
    },
    {
      path: '/check-in-out',
      element: (
      <ProtectedRoute allowedRoles={['vendedor' , 'mecanico']}> 
         <CheckInOut /> 
      </ProtectedRoute>
      ),
    },
    { 
      path: '/work-hours/:userId', 
      element: (
          <ProtectedRoute allowedRoles={['administrador']}>
              <WorkHours />
          </ProtectedRoute>
      )
    },
    { 
    path: '/my-shifts', 
    element: (
        <ProtectedRoute allowedRoles={['vendedor' , 'mecanico']}>
            <MyShifts />
        </ProtectedRoute>
      )
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
    },//leo
    {
      path: '/work-details/:workId',
      element: (
        <ProtectedRoute allowedRoles={['administrador', 'usuario']}>
          <WorkDetails />
        </ProtectedRoute>
      ),
    },

    {
      path: '/AddMarca',
      element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <AddMarca />
        </ProtectedRoute>
      )
    },
      
      {
        path: '/Inventario',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Inventario />
          </ProtectedRoute>
        )
      },
      {
        path: '/Tareas',
        element: (
        <ProtectedRoute allowedRoles={['administrador', 'mecanico']}>
          <Tareas />
        </ProtectedRoute>
        ),
      },
      {
      path: '/AddTareas',
      element: (
      <ProtectedRoute allowedRoles={['administrador', 'mecanico']}>
        <AddTareas />
      </ProtectedRoute>
      ),
      },
      {
        path: '/AddComentario',
        element: (
        <ProtectedRoute allowedRoles={['administrador', 'mecanico']}>
          <AddComentario />
        </ProtectedRoute>
        ),
        },
      {
        path: '/comentario',
        element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <Comentario />
        </ProtectedRoute>
          ),
      },

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