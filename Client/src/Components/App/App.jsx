import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import '../../../src/App.css';
import MasterLayout from '../MasterLayout/MasterLayout';
import NotFound from '../NotFound/NotFound';
import Home from '../Home/Home';
import Users from '../Users/Users';
import Delivery from '../Delivery/Delivery';
import Login from '../Login/Login';
import Clients from '../Clients/Clients';
import Settings from '../Settings/Settings'

function App() {
  let routes = createBrowserRouter([
    {
      path:'/' ,element: <MasterLayout/>,
      children:
      [
        {index:true , element: <Home/> },
        {path:'delivery' , element:<Delivery/>},
        {path:'clients' , element: <Clients/>},
        {path: 'settings', element: <Settings/>},
        {path:'users', element:<Users/>},
        {path:'login' , element:<Login/>},
        
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
