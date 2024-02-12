import { BrowserRouter,  Route, Router, Routes } from 'react-router-dom';
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
import { useContext } from 'react';
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
import CustomersService from '../CustomersService/CustomersService';
import AddStatus from '../CustomersService/AddStatus';
import AddShortComingsDoctor from '../ShortComings/AddShortComingsDoctor';
import DoctorPurchases from '../Purchases/DoctorPurchases';
import DoctorPurchasesDeatils from '../Purchases/DoctorPurchasesDeatils';
import DeleteOrderDelivery from '../Delivery/DeleteOrderDelivery';
import EditePurchasesDoctor from '../Doctor/EditePurchasesDoctor';
import DoctorEditeOrder from '../Doctor/DoctorEditeOrder';
import DoctorOrderDetails from '../Doctor/DoctorOrderDetails';
import Offers from '../Offers/Offers';
import AddOffer from '../Offers/AddOffer';
import DeleteOffer from '../Offers/DeleteOffer';
import EditeOffer from '../Offers/EditeOffer';
import Companies from '../Companies/Companies';
import DoctorOffers from '../Doctor/Offers/DoctorOffers';
import AddOfferDoctor from '../Doctor/Offers/AddOfferDoctor';
import EditeOffersDoctor from '../Doctor/Offers/EditeOffersDoctor';
import AddCompany from '../Companies/AddCompany';
import EditeCompany from '../Companies/EditeCompany';
import Rules from '../Rules/Rules';
import AddRules from '../Rules/AddRules';
import EditeRule from '../Rules/EditeRule';
import InventoryProducts from '../InventoryProducts/InventoryProducts';
import Notifications from '../Notifications/Notifications';
import AddNotification from '../Notifications/AddNotification';
import DoctorNotifications from '../Doctor/Notifications/DoctorNotifications';
import AddDoctorNotifications from '../Doctor/Notifications/AddDoctorNotifications';
import AddInventoryProducts from '../InventoryProducts/AddInventoryProducts';
import AddDoctorInventoryProducts from '../Doctor/InventoryProducts/AddDoctorInventoryProducts';
import DoctorInventoryProducts from '../Doctor/InventoryProducts/DoctorInventoryProducts';
import SellingIncentives from '../SellingIncentives/SellingIncentives';
import AddSellingIncentives from '../SellingIncentives/AddSellingIncentives';
import DoctorRules from '../Doctor/Rules/DoctorRules';
import DeliveryRules from '../Delivery/Rules/DeliveryRules';
import ReasonsOfIncentives from '../SellingIncentives/ReasonsOfIncentives';
import DeleteSellingIncentives from '../SellingIncentives/DeleteSellingIncentives';
import EditeSellingIncentives from '../SellingIncentives/EditeSellingIncentives';
import DoctorSellingIncentives from '../Doctor/SellingIncentives/DoctorSellingIncentives';
import PurchasesLayout from '../Layouts/PurchasesLayout';
import PurchasesUser from '../PurchasesUser.jsx/Purchases/PurchasesUser';
import PurchasesInventoryProducts from '../PurchasesUser.jsx/InventoryProducts/PurchasesInventoryProducts';
import PurchasesCompanies from '../PurchasesUser.jsx/Companies/PurchasesCompanies';
import PurchasesCustomerService from '../PurchasesUser.jsx/CustomerService/PurchasesCustomerService';
import AddPurchasesCompanies from '../PurchasesUser.jsx/Companies/AddPurchasesCompanies';
import EditePurchasesCompanies from '../PurchasesUser.jsx/Companies/EditePurchasesCompanies';
import AddPurchasesInventoryProducts from '../PurchasesUser.jsx/InventoryProducts/AddPurchasesInventoryProducts';
import AddShortComingsPurchases from '../PurchasesUser.jsx/Purchases/AddShortComingsPurchases';
import EditePurchasesUser from '../PurchasesUser.jsx/Purchases/EditePurchasesUser';
import DeletePurchasesUser from '../PurchasesUser.jsx/Purchases/DeletePurchasesUser';
import PurchasesUserDetails from '../PurchasesUser.jsx/Purchases/PurchasesUserDetails';




function App() {

  let { saveUserData  } = useContext(AuthContext);
  
  return (
    <>
      <Offline> <div className='offline'>.أنت غير متصل بالإنترنت</div> </Offline>

      <BrowserRouter>
        <Routes>
          <Route index element={<Login saveUserData={saveUserData} />} ></Route>
          <Route path='/' element={< MasterLayout />}>
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
            <Route path='shortcomings/add' element={<ProtectedRoute ><AddShortComings /></ProtectedRoute>} ></Route>
            <Route path='purchases' element={<ProtectedRoute ><Purchases /></ProtectedRoute>} ></Route>
            <Route path='purchases/delete/:id' element={<ProtectedRoute ><DeletePurchases /></ProtectedRoute>} ></Route>
            <Route path='purchases/edite/:id' element={<ProtectedRoute ><EditePurchases /></ProtectedRoute>} ></Route>
            <Route path='purchases/details/:id' element={<ProtectedRoute ><PurchasesDeatils /></ProtectedRoute>} ></Route>
            <Route path='customersservice' element={<ProtectedRoute ><CustomersService /></ProtectedRoute>} ></Route>
            <Route path='addstatus' element={<ProtectedRoute ><AddStatus /></ProtectedRoute>} ></Route>
            <Route path='offers' element={<ProtectedRoute ><Offers /></ProtectedRoute>} ></Route>
            <Route path='offers/add' element={<ProtectedRoute ><AddOffer /></ProtectedRoute>} ></Route>
            <Route path='offers/delete/:id' element={<ProtectedRoute ><DeleteOffer /></ProtectedRoute>} ></Route>
            <Route path='offers/edite/:id' element={<ProtectedRoute ><EditeOffer /></ProtectedRoute>} ></Route>
            <Route path='companies' element={<ProtectedRoute ><Companies /></ProtectedRoute>} ></Route>
            <Route path='companies/add' element={<ProtectedRoute ><AddCompany /></ProtectedRoute>} ></Route>
            <Route path='companies/edite/:id' element={<ProtectedRoute ><EditeCompany /></ProtectedRoute>} ></Route>
            <Route path='rules' element={<ProtectedRoute ><Rules /></ProtectedRoute>} ></Route>
            <Route path='rules/add' element={<ProtectedRoute ><AddRules /></ProtectedRoute>} ></Route>
            <Route path='rules/edite/:id' element={<ProtectedRoute ><EditeRule /></ProtectedRoute>} ></Route>
            <Route path='inventoryproducts' element={<ProtectedRoute ><InventoryProducts /></ProtectedRoute>} ></Route>
            <Route path='inventoryproducts/add' element={<ProtectedRoute ><AddInventoryProducts /></ProtectedRoute>} ></Route>
            <Route path='notifications' element={<ProtectedRoute ><Notifications /></ProtectedRoute>} ></Route>
            <Route path='notifications/add' element={<ProtectedRoute ><AddNotification /></ProtectedRoute>} ></Route>
            <Route path='sellingincentives' element={<ProtectedRoute ><SellingIncentives /></ProtectedRoute>} ></Route>
            <Route path='sellingincentives/add' element={<ProtectedRoute ><AddSellingIncentives /></ProtectedRoute>} ></Route>
            <Route path='sellingincentives/delete/:id' element={<ProtectedRoute ><DeleteSellingIncentives /></ProtectedRoute>} ></Route>
            <Route path='sellingincentives/edite/:id' element={<ProtectedRoute ><EditeSellingIncentives /></ProtectedRoute>} ></Route>
            <Route path='reasonsofincentives' element={<ProtectedRoute ><ReasonsOfIncentives /></ProtectedRoute>} ></Route>

  
          </Route>
          <Route path='/' element={<ProtectedRoute><DeliveryLayout /></ProtectedRoute>}>
            <Route path='/deliveryOrders/:id' element={<ProtectedRoute><DeliveryOrders /></ProtectedRoute>}></Route>
            <Route path='/deliveryOrders/add/:id' element={<ProtectedRoute><AddOrderDelivery /></ProtectedRoute>}></Route>
            <Route path='/deliveryOrders/delete/:id' element={<ProtectedRoute><DeleteOrderDelivery /></ProtectedRoute>}></Route>
            <Route path='/deliveryrules' element={<ProtectedRoute><DeliveryRules /></ProtectedRoute>}></Route>
   
          </Route>
          <Route path='/' element={<ProtectedRoute><PurchasesLayout /></ProtectedRoute>}>
            <Route path='/purchasesuser' element={<ProtectedRoute><PurchasesUser /></ProtectedRoute>}></Route>
            <Route path='/purchasesuser/edite/:id' element={<ProtectedRoute><EditePurchasesUser /></ProtectedRoute>}></Route>
            <Route path='/purchasesuser/delete/:id' element={<ProtectedRoute><DeletePurchasesUser /></ProtectedRoute>}></Route>
            <Route path='/purchasesuser/details/:id' element={<ProtectedRoute><PurchasesUserDetails /></ProtectedRoute>}></Route>
            <Route path='/shortcomingspurchases/add' element={<ProtectedRoute><AddShortComingsPurchases /></ProtectedRoute>}></Route>
            <Route path='/purchasesinventoryproducts' element={<ProtectedRoute><PurchasesInventoryProducts /></ProtectedRoute>}></Route>
            <Route path='/purchasesinventoryproducts/add' element={<ProtectedRoute><AddPurchasesInventoryProducts /></ProtectedRoute>}></Route>
            <Route path='/purchasescompanies' element={<ProtectedRoute><PurchasesCompanies /></ProtectedRoute>}></Route>
            <Route path='/purchasescompanies/add' element={<ProtectedRoute><AddPurchasesCompanies /></ProtectedRoute>}></Route>
            <Route path='/purchasescompanies/edite/:id' element={<ProtectedRoute><EditePurchasesCompanies /></ProtectedRoute>}></Route>
            <Route path='/purchasescustomerservice' element={<ProtectedRoute><PurchasesCustomerService /></ProtectedRoute>}></Route>
   
          </Route>
          <Route path='/' element={<ProtectedRoute><DoctorLayout /></ProtectedRoute>}>
            <Route  path='/doctorpurchases' element={<ProtectedRoute ><DoctorPurchases /></ProtectedRoute>} ></Route>
            <Route path='/doctorpurchases/add' element={<ProtectedRoute ><AddShortComingsDoctor /></ProtectedRoute>} ></Route>
            <Route path='/doctorpurchases/details/:id' element={<ProtectedRoute><DoctorPurchasesDeatils /></ProtectedRoute>} ></Route>
            <Route path='/doctorpurchases/edite/:id' element={<ProtectedRoute><EditePurchasesDoctor /></ProtectedRoute>} ></Route>
            <Route  path='/doctorOrders/:id' element={<ProtectedRoute><DoctorOrders /></ProtectedRoute>}></Route>
            <Route path='/doctorOrders/add/:id' element={<ProtectedRoute><AddOrderDoctor /></ProtectedRoute>}></Route>
            <Route path='/doctorOrders/edite/:id' element={<ProtectedRoute><DoctorEditeOrder /></ProtectedRoute>}></Route>
            <Route path='/doctorOrders/details/:id' element={<ProtectedRoute><DoctorOrderDetails /></ProtectedRoute>}></Route>
            <Route path='/doctoroffers' element={<ProtectedRoute><DoctorOffers /></ProtectedRoute>}></Route>
            <Route path='/doctoroffers/add' element={<ProtectedRoute><AddOfferDoctor /></ProtectedRoute>}></Route>
            <Route path='/doctoroffers/edite/:id' element={<ProtectedRoute><EditeOffersDoctor /></ProtectedRoute>}></Route>
            <Route path='/doctornotifications' element={<ProtectedRoute><DoctorNotifications /></ProtectedRoute>}></Route>
            <Route path='/doctornotifications/add' element={<ProtectedRoute><AddDoctorNotifications /></ProtectedRoute>}></Route>
            <Route path='/doctorinventoryproducts' element={<ProtectedRoute><DoctorInventoryProducts /></ProtectedRoute>}></Route>
            <Route path='/doctorinventoryproducts/add' element={<ProtectedRoute><AddDoctorInventoryProducts /></ProtectedRoute>}></Route>
            <Route path='/doctorrules' element={<ProtectedRoute><DoctorRules /></ProtectedRoute>}></Route>
            <Route path='/doctorsellingincentives' element={<ProtectedRoute><DoctorSellingIncentives /></ProtectedRoute>}></Route>

          </Route>
          <Route path='*' element={<ProtectedRoute ><NotFound /></ProtectedRoute>}></Route>
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
