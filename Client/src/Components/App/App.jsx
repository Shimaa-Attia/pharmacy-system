import { BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter, useNavigate } from 'react-router-dom';
import '../../../src/App.css';
import MasterLayout from '../Layouts/MasterLayout';
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
import { AuthContext } from '../../Context/AuthStore';
import DeliveryLayout from '../Layouts/DeliveryLayout';
import AddOrderDelivery from '../Delivery/AddOrderDelivery'
import DeliveryOrders from '../Delivery/DeliveryOrders';
import EditeDeliveryOrder from '../Delivery/EditeDeliveryOrder';



function App() {

  let { userData, saveUserData, logout } = useContext(AuthContext);
  return (
    <>
      <Offline> <div className='offline'>.أنت غير متصل بالإنترنت</div> </Offline>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login  saveUserData={saveUserData} />} ></Route>
          <Route path='/' element={< MasterLayout userData={userData} logout={logout} />}>
            <Route path='home' element={<ProtectedRoute userData={userData} ><Home /></ProtectedRoute>} ></Route>
            <Route path='users' element={<ProtectedRoute userData={userData} ><Users /></ProtectedRoute>} ></Route>
            <Route path='users/add' element={<ProtectedRoute userData={userData} ><AddUser /></ProtectedRoute>} ></Route>
            <Route path='users/delete/:id' element={<ProtectedRoute userData={userData} ><DeleteUser /></ProtectedRoute>} ></Route>
            <Route path='users/edite/:id' element={<ProtectedRoute userData={userData} ><EditeUser /></ProtectedRoute>} ></Route>
            <Route path='users/details/:id' element={<ProtectedRoute userData={userData} ><UserDetails /></ProtectedRoute>} ></Route>
            <Route path='clients' element={<ProtectedRoute userData={userData} ><Clients /></ProtectedRoute>} ></Route>
            <Route path='clients/add' element={<ProtectedRoute userData={userData} ><AddClient /></ProtectedRoute>} ></Route>
            <Route path='clients/delete/:id' element={<ProtectedRoute userData={userData} ><DeleteClient /></ProtectedRoute>} ></Route>
            <Route path='clients/edite/:id' element={<ProtectedRoute userData={userData} ><EditeClient /></ProtectedRoute>} ></Route>
            <Route path='clients/details/:id' element={<ProtectedRoute userData={userData} ><ClientDetails /></ProtectedRoute>} ></Route>
            <Route path='orders' element={<ProtectedRoute userData={userData} ><Orders /></ProtectedRoute>} ></Route>
            <Route path='orders/add' element={<ProtectedRoute userData={userData} ><AddOrder /></ProtectedRoute>} ></Route>
            <Route path='orders/delete/:id' element={<ProtectedRoute userData={userData} ><DeleteOrder /></ProtectedRoute>} ></Route>
            <Route path='orders/edite/:id' element={<ProtectedRoute userData={userData} ><EditeOrder /></ProtectedRoute>} ></Route>
            <Route path='orders/details/:id' element={<ProtectedRoute userData={userData} ><OrderDetails /></ProtectedRoute>} ></Route>
            <Route path='settings' element={<ProtectedRoute userData={userData} ><Settings /></ProtectedRoute>} ></Route>
            <Route path='*' element={<ProtectedRoute userData={userData} ><NotFound /></ProtectedRoute>} ></Route>
          </Route>
          <Route path='deliverylayout' element={<ProtectedRoute><DeliveryLayout/></ProtectedRoute>}>
            <Route path='deliveryOrders/:id' element={<ProtectedRoute><DeliveryOrders/></ProtectedRoute>}></Route>
            <Route path='add/:id' element={<ProtectedRoute><AddOrderDelivery/></ProtectedRoute>}></Route>
            <Route path='edite/:id' element={<ProtectedRoute><EditeDeliveryOrder/></ProtectedRoute>}></Route>
            <Route path='*' element={<ProtectedRoute userData={userData} ><NotFound /></ProtectedRoute>}></Route>

          </Route>
        </Routes>
      </BrowserRouter>


      {/* <RouterProvider router={adminRoutes} /> */}


      <ToastContainer
        position='top-left'
        autoClose={5000}
      />

    </>
  );
}

export default App;
