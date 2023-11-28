import React from 'react';
import styles from './MasterLayout.module.css'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Login from '../Login/Login';
import Users from '../Users/Users';


export default function MasterLayout() {
  return (
    <>
     

        <div className=" g-0 row">
          <div className="col-10">
            <Navbar />
            <Outlet />
          </div>
          <div className='col-2 position-fixed top-0 end-0 bottom-0  ' >
            <Sidebar />
          </div>
        </div>
      
    </>
  )
}
