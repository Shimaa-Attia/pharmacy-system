import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import { useContext} from 'react';
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
import SalePoints from '../SalePoints/SalePoints';
import DoctorLayout from '../Layouts/DoctorLayout';
import DoctorOrders from '../Doctor/DoctorOrders';
import AddOrderDoctor from '../Doctor/AddOrderDoctor';
import Branches from '../Branches/Branches';
import AddShortComings from '../ShortComings/AddShortComings';
import Purchases from '../Purchases/Purchases';
import PurchasesDeatils from '../Purchases/PurchasesDeatils';
import EditePurchases from '../Purchases/EditePurchases';
import DeletePurchases from '../Purchases/DeletePurchases';



function App() {

  let { saveUserData} = useContext(AuthContext);
  return (
    <>
      <Offline> <div className='offline'>.أنت غير متصل بالإنترنت</div> </Offline>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login  saveUserData={saveUserData} />} ></Route>
          <Route path='/' element={< MasterLayout/>}>
            <Route path='home' element={<ProtectedRoute ><Home /></ProtectedRoute>} ></Route>
            <Route path='users' element={<ProtectedRoute ><Users /></ProtectedRoute>} ></Route>
            <Route path='users/add' element={<ProtectedRoute ><AddUser /></ProtectedRoute>} ></Route>
            <Route path='users/delete/:id' element={<ProtectedRoute ><DeleteUser /></ProtectedRoute>} ></Route>
            <Route path='users/edite/:id' element={<ProtectedRoute ><EditeUser /></ProtectedRoute>} ></Route>
            <Route path='users/details/:id' element={<ProtectedRoute ><UserDetails /></ProtectedRoute>} ></Route>
            <Route path='clients' element={<ProtectedRoute ><Clients /></ProtectedRoute>} ></Route>
            <Route path='clients/add' element={<ProtectedRoute ><AddClient /></ProtectedRoute>} ></Route>
            <Route path='clients/delete/:id' element={<ProtectedRoute ><DeleteClient /></ProtectedRoute>} ></Route>
            <Route path='clients/edite/:id' element={<ProtectedRoute ><EditeClient /></ProtectedRoute>} ></Route>
            <Route path='clients/details/:id' element={<ProtectedRoute ><ClientDetails /></ProtectedRoute>} ></Route>
            <Route path='orders' element={<ProtectedRoute ><Orders /></ProtectedRoute>} ></Route>
            <Route path='orders/add' element={<ProtectedRoute ><AddOrder /></ProtectedRoute>} ></Route>
            <Route path='orders/delete/:id' element={<ProtectedRoute ><DeleteOrder /></ProtectedRoute>} ></Route>
            <Route path='orders/edite/:id' element={<ProtectedRoute ><EditeOrder /></ProtectedRoute>} ></Route>
            <Route path='orders/details/:id' element={<ProtectedRoute ><OrderDetails /></ProtectedRoute>} ></Route>
            <Route path='settings' element={<ProtectedRoute ><Settings /></ProtectedRoute>} ></Route>
            <Route path='salepoints' element={<ProtectedRoute ><SalePoints /></ProtectedRoute>} ></Route>
            <Route path='branches' element={<ProtectedRoute ><Branches /></ProtectedRoute>} ></Route>
            <Route path='shortcomings' element={<ProtectedRoute ><AddShortComings /></ProtectedRoute>} ></Route>
            <Route path='purchases' element={<ProtectedRoute ><Purchases /></ProtectedRoute>} ></Route>
            <Route path='purchases/delete/:id' element={<ProtectedRoute ><DeletePurchases /></ProtectedRoute>} ></Route>
            <Route path='purchases/edite/:id' element={<ProtectedRoute ><EditePurchases /></ProtectedRoute>} ></Route>
            <Route path='purchases/details/:id' element={<ProtectedRoute ><PurchasesDeatils /></ProtectedRoute>} ></Route>
            <Route path='*' element={<ProtectedRoute ><NotFound /></ProtectedRoute>} ></Route>
          </Route>
          <Route path='deliverylayout' element={<ProtectedRoute><DeliveryLayout/></ProtectedRoute>}>
            <Route path='deliveryOrders/:id' element={<ProtectedRoute><DeliveryOrders/></ProtectedRoute>}></Route>
            <Route path='add/:id' element={<ProtectedRoute><AddOrderDelivery/></ProtectedRoute>}></Route>
            <Route path='*' element={<ProtectedRoute ><NotFound /></ProtectedRoute>}></Route>
          </Route>
          <Route path='doctorlayout' element={<ProtectedRoute><DoctorLayout/></ProtectedRoute>}>
            <Route path='doctorOrders/:id' element={<ProtectedRoute><DoctorOrders/></ProtectedRoute>}></Route>
            <Route path='add/:id' element={<ProtectedRoute><AddOrderDoctor/></ProtectedRoute>}></Route>
            <Route path='*' element={<ProtectedRoute ><NotFound /></ProtectedRoute>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>


      <ToastContainer
        position='top-left'
        autoClose={5000}
      />

    </>
  );
}

export default App;
