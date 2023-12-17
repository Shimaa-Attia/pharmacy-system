import { RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
import '../../../src/App.css';
import MasterLayout from '../MasterLayout/MasterLayout';
import NotFound from '../NotFound/NotFound';
import Home from '../Home/Home';
import Users from '../Users/Users';
import Login from '../Login/Login';
import Clients from '../Clients/Clients';
import Settings from '../Settings/Settings'
import AddUser from '../Users/AddUser';
import DeleteUser from '../Users/DeleteUser';
import EditeUser from '../Users/EditeUser';
import UserDetails from '../Users/UserDetails';
import { useContext, useEffect, useState } from 'react';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import AddClient from '../Clients/AddClient';
import EditeClient from '../Clients/EditeClient';
import ClientDetails from '../Clients/ClientDetails';
import Orders from '../Orders/Orders';
import AddOrder from '../Orders/AddOrder';
import DeleteOrder from '../Orders/DeleteOrder';
import EditeOrder from '../Orders/EditeOrder';
import OrderDetails from '../Orders/OrderDetails';
import { ToastContainer } from 'react-toastify';
import DeleteClient from '../Clients/DeleteClient';
import { Offline, Online } from 'react-detect-offline';
import AddOrderDelivery from '../Delivery/AddOrderDelivery';
import { AuthContext } from '../../Context/AuthStore';



function App() {

let { userData, saveUserData ,logout } = useContext(AuthContext);
 
  let routes = createBrowserRouter([

    { index: true, element: <Login saveUserData={saveUserData} /> },
    {
      path: '/', element: < MasterLayout userData={userData} logout={logout} />,
      children:
        [
          { path: 'home', element: <ProtectedRoute  userData={userData} ><Home /></ProtectedRoute> },
          { path: 'orders', element: <ProtectedRoute  userData={userData}><Orders /> </ProtectedRoute> },
          { path: 'orders/add', element: <ProtectedRoute  userData={userData}><AddOrder /> </ProtectedRoute> },
          { path: 'orders/delete/:id', element: <ProtectedRoute  userData={userData}><DeleteOrder /> </ProtectedRoute> },
          { path: 'orders/edite/:id', element: <ProtectedRoute  userData={userData}><EditeOrder /> </ProtectedRoute> },
          { path: 'orders/details/:id', element: <ProtectedRoute  userData={userData}><OrderDetails /> </ProtectedRoute> },
          { path: 'clients', element: <ProtectedRoute  userData={userData}><Clients /> </ProtectedRoute> },
          { path: 'clients/add', element: <ProtectedRoute  userData={userData}><AddClient /> </ProtectedRoute> },
          { path: 'clients/delete/:id', element: <ProtectedRoute  userData={userData}><DeleteClient /> </ProtectedRoute> },
          { path: 'clients/edite/:id', element: <ProtectedRoute  userData={userData}><EditeClient /> </ProtectedRoute> },
          { path: 'clients/details/:id', element: <ProtectedRoute  userData={userData}><ClientDetails /> </ProtectedRoute> },
          { path: 'settings', element: <ProtectedRoute  userData={userData}><Settings />  </ProtectedRoute> },
          { path: 'users', element: <ProtectedRoute  userData={userData}><Users /> </ProtectedRoute> },
          { path: 'users/add', element: <ProtectedRoute  userData={userData}><AddUser /> </ProtectedRoute> },
          { path: 'users/delete/:id', element: <ProtectedRoute  userData={userData}><DeleteUser /> </ProtectedRoute> },
          { path: 'users/edite/:id', element: <ProtectedRoute  userData={userData}><EditeUser /> </ProtectedRoute> },
          { path: 'users/details/:id', element: <ProtectedRoute  userData={userData}><UserDetails /> </ProtectedRoute> },
          { path: 'delivery/add', element: <ProtectedRoute  userData={userData}><AddOrderDelivery /></ProtectedRoute> },
          { path: '*', element: <NotFound /> }

        ]
    }
  ])
  return (
    <>

      <Offline> <div className='offline'>.أنت غير متصل بالإنترنت</div> </Offline>


      <RouterProvider router={routes} />
      <ToastContainer
        position='top-left'
        autoClose={5000}
      />

    </>
  );
}

export default App;
