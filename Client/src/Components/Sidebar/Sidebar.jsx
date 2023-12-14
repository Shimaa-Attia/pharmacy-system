import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import Login from '../Login/Login';

export default function Sidebar({ userData }) {


    return (
        <>
        {userData? 
            <div className="container-fluid sidebar position-fixed top-0  bottom-0 ">
                <div className="row">
                    <div className=" bg-white col-auto col-md-2 min-vh-100 d-flex flex-column  ">
                        <div className=''>
                            <ul className='nav nav-pills'>
                                <li className='nav-item'>
                                    <button className='nav-link text-black '  >
                                        <i className="bi bi-chevron-left  "></i>
                                    </button>
                                </li>
                            </ul>
                         
                            <div>
                            <hr />
                            <ul className="nav nav-pills flex-column ">
                                <li className="nav-item my-1">
                                    <NavLink to='home' className="nav-link text-black fw-bolder  " aria-current="page">
                                        <span className='me-3 d-none d-sm-inline'> الرئيسية </span>
                                        <i className="bi bi-motherboard "></i>
                                    </NavLink>
                                </li>
                                <li className="nav-item my-1">
                                    <NavLink to='orders' className="nav-link text-black fw-bolder" aria-current="page">
                                        <span className='me-3 d-none d-sm-inline'> الطيارين </span>
                                        <i className="bi bi-cart3 "></i>
                                    </NavLink>
                                </li>
                                <li className="nav-item my-1 ">
                                    <NavLink to='clients' className="nav-link text-black  fw-bolder" aria-current="page">
                                        <span className='me-3 d-none d-sm-inline'> العملاء</span>
                                        <i className="bi bi-people-fill"></i>
                                    </NavLink>
                                </li>

                            </ul>
                            </div>
                        </div>
                        <hr />
                        <div>
                            <ul className="nav nav-pills flex-column">
                                <li className="nav-item my-1">
                                    <NavLink to='users' className="nav-link text-black  fw-bolder" aria-current="page">
                                        <span className='me-3 d-none d-sm-inline'> المستخدمون</span>
                                        <i className="bi bi-people-fill"></i>

                                    </NavLink>
                                </li>
                                <li className="nav-item my-1 ">
                                    <NavLink to='settings' className="nav-link text-black  fw-bolder" aria-current="page">
                                        <span className='me-3 d-none d-sm-inline'> الإعدادات</span>
                                        <i className="bi bi-gear-wide-connected"></i>
                                    </NavLink>
                                </li>


                            </ul>
                        </div>
                    </div>
                </div>

            </div>:''}
            {/* {userData ?
         <nav className={`${styles.sidebar} bg-white  min-vh-100 `}>
         <div className={`side-navs  `} >
             <a className={`d-block  text-black text-start ps-3  ${styles.sparator}`} style={{ lineHeight: '55px' }} >
                 <i className="bi bi-chevron-left "></i>
             </a>
             <div className="nav nav-pills text-end flex-column">
                 <ul className=' navbar-nav  flex-column py-2 '>
                     <li className='nav-item   py-2 '>
                         <NavLink to='home' className=' nav-link' >
                             <span className='px-5 '> <strong>الرئيسية</strong></span>
                             <i className="bi bi-motherboard pe-2 "></i>
                         </NavLink>
                     </li>
                     <li className='nav-item  py-2' >
                         <NavLink to='orders' className='nav-link'  >
                             <span className='px-5'> <strong> الطيارين</strong></span>
                             <i className="bi bi-cart3 pe-2 "></i>
                         </NavLink>
                     </li>
                     <li className={`nav-item  py-2`}>
                         <NavLink to='clients' className='nav-link'  >
                             <span className='px-5'> <strong>العملاء</strong></span>
                             <i className="bi bi-people-fill pe-2 "></i>
                         </NavLink>
                     </li>
                 </ul>
                 <div className={`${styles.sparator} `}></div>
                 <ul className=' flex-column py-2 navbar-nav ' >
                     <li className='nav-item  py-2' >
                         <NavLink to='users' className='nav-link'  >
                             <span className='px-5' > <strong>المستخدمون</strong> </span>
                             <i className="bi bi-people-fill pe-2 "></i>
                         </NavLink>
                     </li>
                     <li className='nav-item  py-2' >
                         <NavLink to='settings' className='nav-link' >
                             <span className='px-5 '> <strong>الإعدادات</strong></span>
                             <i className="bi bi-gear-wide-connected pe-2 "></i>
                         </NavLink>
                     </li>

                 </ul>
             </div>
         </div>
     </nav> : ''
        } */}


        </>
    )
}
