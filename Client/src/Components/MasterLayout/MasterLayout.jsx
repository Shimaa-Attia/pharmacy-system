import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'

import { ToastContainer } from "react-toastify";



export default function MasterLayout({userData ,logout}) {

  return (
    <>
     
    
        <div className=" g-0 row">
          <div className="col-10">
            <Navbar userData={userData}  logout={logout} />
            <Outlet/>
          </div>
          <div className='col-auto' >
            <Sidebar userData={userData} />
          </div>
        </div> 
        
      
      

 
    </>
  )
}
