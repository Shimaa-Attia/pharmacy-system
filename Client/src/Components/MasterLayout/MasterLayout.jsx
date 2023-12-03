import React from 'react';
import styles from './MasterLayout.module.css'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Login from '../Login/Login';
import Users from '../Users/Users';
import Settings from '../Settings/Settings';
import {ToastContainer} from "react-toastify";


export default function MasterLayout({userData ,setUserData }) {
  let navigate = useNavigate();
  let logOut = ()=>{
    localStorage.removeItem('userToken');
    setUserData(null);
    console.log("logout success");
    navigate('');
  }


  return (
    <>
     {userData ?
       <div className=" g-0 row">
       <div className="col-10">
         <Navbar userData={userData}  />
          <Outlet />
          {/* <Outlet  context={{logOut}} /> */}
       </div>
       <div className='col-2 position-fixed top-0 end-0 bottom-0  ' >
         <Sidebar  userData={userData} />
       </div>
     </div> : 
     <div className="">
      <Outlet/>
     </div>
    }
     <Settings logout={logOut} ></Settings>
      <ToastContainer/>
    </>
  )
}
