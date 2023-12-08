import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Login from '../Login/Login';
import Users from '../Users/Users';
import Settings from '../Settings/Settings';
import { ToastContainer } from "react-toastify";
import Logout from '../Logout/Logout';


export default function MasterLayout({userData , setUserData}) {

  return (
    <>
     
    
        <div className=" g-0 row">
          <div className="col-10">
            <Navbar userData={userData} />
            <Outlet/>
          </div>
          <div className='col-2 position-fixed top-0 end-0 bottom-0  ' >
            <Sidebar userData={userData} />
          </div>
        </div> 
        
      
      

 
    </>
  )
}
