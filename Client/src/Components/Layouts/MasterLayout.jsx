import React from 'react';
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import SalePointModal from '../SalePointModal/SalePointModal';

export default function MasterLayout() {

  return (
    <>
      <SalePointModal/>
      <div className=" g-0 row">
        <div className="col-10">
          <Navbar />
          <main>
            <Outlet />
          </main>

        </div>
        <div className='col-auto'>
          <Sidebar />
        </div>
      </div>






    </>
  )
}
