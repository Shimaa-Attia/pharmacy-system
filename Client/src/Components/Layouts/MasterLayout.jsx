import React from 'react';
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'


export default function MasterLayout() {


  return (
    <>

      <div className=" g-0 row">
        <div className="col-10">
          <Navbar />
          <main>
            <Outlet />
          </main>

        </div>
        <div className='col-auto' >
          <Sidebar  />
        </div>
      </div>





    </>
  )
}
