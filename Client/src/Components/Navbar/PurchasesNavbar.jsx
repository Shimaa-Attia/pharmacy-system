
import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';
import axios from 'axios';

export default function PurchasesNavbar() {
    let { logout, userData, accessToken, userName } = useContext(AuthContext);
    let [users, setUsers] = useState([]);
 
    return (
        <>

            {userData ? <nav className="navbar navbar-expand-lg bg-primary">
                <div className="container">
                    <div className='dropdown'>
                        <a className="nav-link" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-person-circle text-white fs-3"></i>
                        </a>
                        <ul className="dropdown-menu">

                            <NavLink to='/' onClick={logout} className="dropdown-item " > تسجيل خروج</NavLink>
                        </ul>

                    </div>
                    <div className='ms-2 '>
                        <p className=' text-white fw-bold fs-6'>{userName}</p>
                    </div>
                    <button className="navbar-toggler text-white mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon  " />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            {/* <li className="nav-item">
                                <NavLink className="nav-link  text-white fs-6 fw-bold " aria-current="page" to={`/doctorrules`} >التعليمات</NavLink>
                            </li> */}
                          
                            <li className="nav-item">
                                <NavLink className="nav-link  text-white fs-6 fw-bold " aria-current="page" to={`/purchasescustomerservice`} >خدمة العملاء</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link  text-white fs-6 fw-bold " aria-current="page" to={`/purchasescompanies`} >الشركات</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link  text-white fs-6 fw-bold " aria-current="page" to={`/purchasesinventoryproducts`} >الجرد</NavLink>
                            </li>
                          
                            <li className="nav-item">
                                <NavLink className="nav-link  text-white fs-6 fw-bold " aria-current="page" to={`/purchasesuser`} >المشتريات</NavLink>
                            </li>
                       
                        </ul>

                    </div>
                </div>
            </nav> : ''}


        </>
    )
}
