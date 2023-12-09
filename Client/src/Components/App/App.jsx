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
import { jwtDecode } from 'jwt-decode';
import { ToastContainer } from 'react-toastify';
import DeleteClient from '../Clients/DeleteClient';
import { Offline, Online } from 'react-detect-offline';






function App() {

  // for handle Reload
  useEffect(() => {
    if (localStorage.getItem('userToken') !== null) {
      saveUserData();
    }
  }, []);

  let [userData, setUserData] = useState(null);
  let saveUserData = () => {
    let encodedToken = localStorage.getItem('userToken');
    setUserData(encodedToken);
    // console.log(userData);
    // let decodedToken = jwtDecode(encodedToken);
    // setUserData(decodedToken);
    // console.log(userData);

  };

  let routes = createBrowserRouter([
    
      { index: true, element: <Login saveUserData={saveUserData} /> },
     { path: '/', element: < MasterLayout userData={userData}  />,
      children:
        [
       
          { path: 'home', element: <ProtectedRoute ><Home/></ProtectedRoute> },
          { path: 'orders', element:<ProtectedRoute><Orders /> </ProtectedRoute>  },
          { path: 'orders/add', element: <ProtectedRoute><AddOrder/> </ProtectedRoute> },
          { path: 'orders/delete/:id', element: <ProtectedRoute><DeleteOrder/> </ProtectedRoute>  },
          { path: 'orders/edite/:id', element: <ProtectedRoute><EditeOrder /> </ProtectedRoute>  },
          { path: 'orders/details/:id', element: <ProtectedRoute><OrderDetails /> </ProtectedRoute>  },
          { path: 'clients', element:<ProtectedRoute><Clients /> </ProtectedRoute>  },
          { path: 'clients/add', element:<ProtectedRoute><AddClient /> </ProtectedRoute>  },
          { path: 'clients/delete/:id', element: <ProtectedRoute><DeleteClient /> </ProtectedRoute>  },
          { path: 'clients/edite/:id', element: <ProtectedRoute><EditeClient /> </ProtectedRoute> },
          { path: 'clients/details/:id', element:<ProtectedRoute><ClientDetails /> </ProtectedRoute>  },
          { path: 'settings', element: <ProtectedRoute><Settings setUserData={setUserData}/>  </ProtectedRoute>  },
          { path: 'users', element:<ProtectedRoute><Users/> </ProtectedRoute>   },
          { path: 'users/add', element: <ProtectedRoute><AddUser /> </ProtectedRoute>  },
          { path: 'users/delete/:id', element: <ProtectedRoute><DeleteUser/> </ProtectedRoute>  },
          { path: 'users/edite/:id', element: <ProtectedRoute><EditeUser /> </ProtectedRoute>   },
          { path: 'users/details/:id', element: <ProtectedRoute><UserDetails /> </ProtectedRoute>  },
          { path: 'logout', element: <Logout /> },
          { path: '*', element: <NotFound /> }

        ]
    }
  ])
  return (
    <>

    <Offline> <div className='offline'>You Are Offline , Contect to the Internet.</div> </Offline>


      <RouterProvider router={routes} />
      <ToastContainer
        position='top-left'
        autoClose={5000}
      />

    </>
  );
}


export default App;
