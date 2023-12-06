import { Navigate, RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
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
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Logout from '../Logout/Logout';
import AddClient from '../Clients/AddClient';
import EditeClient from '../Clients/EditeClient';
import ClientDetails from '../Clients/ClientDetails';
import Orders from '../Orders/Orders';
import AddOrder from '../Orders/AddOrder';
import DeleteOrder from '../Orders/DeleteOrder';
import EditeOrder from '../Orders/EditeOrder';
import OrderDetails from '../Orders/OrderDetails';




function App() {
 
//for handle Reload
  useEffect(()=>{
    if(localStorage.getItem('userToken') !== null){
      saveUserData();
    }
  },[]);
  const [userData, setUserData] = useState(null);

  let saveUserData = () => {
    let encodedToken = localStorage.getItem('userToken');
    setUserData(encodedToken)
    let decodedToken = jwtDecode(encodedToken);
    setUserData(decodedToken);

  };



  let routes = createBrowserRouter([
    {
      path: '/', element: < MasterLayout userData={userData} setUserData={setUserData} />,
      children:
        [
          { index:true, element:  <Login saveUserData={saveUserData}/> },
          { path:'home', element:<Home/>  },
          { path: 'orders', element:  <Orders/>  },
          {path:'orders/add' ,element:<AddOrder/>},
          {path:'orders/delete/:id', element:<DeleteOrder/>},
          {path:'orders/edite/:id' , element:<EditeOrder/>},
          {path:'orders/details/:id' ,element:<OrderDetails/>},
          { path: 'clients', element:  <Clients/>  },
          {path:'clients/add' , element: <AddClient/>},
          {path: 'clients/delete/:id' ,element: <DeleteUser/>},
          {path:'clients/edite/:id' , element: <EditeClient/>},
          {path:'clients/details/:id' ,element: <ClientDetails/>},
          { path: 'settings', element:  <Settings />  },
          { path: 'users', element:  <Users/> },
          { path: 'users/add', element:   <AddUser/>  },
          { path: 'users/delete/:id', element:   <DeleteUser/>  },
          { path: 'users/edite/:id', element:   <EditeUser/>  },
          { path: 'users/details/:id', element:   <UserDetails/> },
          {path:'logout' , element: <Logout/>},
          { path: '*', element: <NotFound /> }

        ]
    }
  ])
  return (
    <>

      <RouterProvider router={routes} />

    </>
  );
}


export default App;
