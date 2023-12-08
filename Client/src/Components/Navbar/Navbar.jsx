import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../Login/Login';

export default function Navbar({ userData }) {

  return (
    <>
    {userData ? 
         <nav className="navbar navbar-expand-lg bg-primary">
         <div className="container-fluid">
           <a className="navbar-brand" href="#"> <i className='fa fa-bell text-white' ></i> </a>
           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
             <span className="navbar-toggler-icon" />
           </button>
           <div className="collapse navbar-collapse" id="navbarSupportedContent">
             <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
               <li className="nav-item">
                 <Link className="nav-link active text-white fs-6 fw-bold " aria-current="page" to='' >Dashboard</Link>
               </li>
             </ul>
 
           </div>
         </div>
       </nav> :''
    }

    </>)
}
