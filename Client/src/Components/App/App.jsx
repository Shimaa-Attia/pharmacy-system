import { Navigate, RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
import '../../../src/App.css';
import MasterLayout from '../MasterLayout/MasterLayout';
import NotFound from '../NotFound/NotFound';
import Home from '../Home/Home';
import Users from '../Users/Users';
import Delivery from '../Delivery/Delivery';
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


function App() {

  useEffect(()=>{
    if(localStorage.getItem('userToken') !== null){
      saveUserData();
    }
  },[])
  const [userData, setUserData] = useState(null);

  let saveUserData = () => {
    let encodedToken = localStorage.getItem('userToken');
    setUserData(encodedToken);
    // let decodedToken = jwtDecode(encodedToken);
   
    // setUserData(decodedToken);
  }

  let routes = createBrowserRouter([
    {
      path: '/', element: <MasterLayout userData={userData} setUserData={setUserData} />,
      children:
        [
          { path:'home', element: <ProtectedRoute userData={userData} ><Home/></ProtectedRoute> },
          { path: 'delivery', element: <ProtectedRoute userData={userData} > <Delivery/></ProtectedRoute> },
          { path: 'clients', element: <ProtectedRoute userData={userData} > <Clients/></ProtectedRoute> },
          { path: 'settings', element: <ProtectedRoute userData={userData} > <Settings/></ProtectedRoute> },
          { path: 'users', element: <ProtectedRoute userData={userData} > <Users/></ProtectedRoute> },
          { path: 'add', element: <ProtectedRoute userData={userData} ><AddUser/></ProtectedRoute> },
          { index:true, element: <ProtectedRoute userData={userData} ><Login saveUserData={saveUserData}/></ProtectedRoute>  },
          { path: 'delete', element:<ProtectedRoute userData={userData} ><DeleteUser/></ProtectedRoute> },
          { path: 'edite', element: <ProtectedRoute userData={userData}><EditeUser/></ProtectedRoute> },
          { path: 'details', element: <ProtectedRoute userData={userData}><UserDetails/></ProtectedRoute>},
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
