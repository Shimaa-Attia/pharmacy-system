import React, { useContext, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { AuthContext } from '../../Context/AuthStore';


export default function Sidebar() {
    let { userData } = useContext(AuthContext);
    return (
        <>
            {userData ?
                <nav className={`container-fluid position-fixed top-0  bottom-0 ${styles.sidebar} `}>
                    <div className="row">
                        <div className=" bg-white col-auto col-md-2  min-vh-100 d-flex flex-column  ">
                            <div >
                                <div className={`${styles.height_55}  d-flex  align-items-center`}>
                                    <button className='nav-link '  >
                                        <i className="bi bi-chevron-left ms-3"></i>
                                    </button>

                                </div>
                                <div className='border-1 border-bottom border-secondary-50'></div>

                                <div>
                                    <ul className="nav  flex-column mb-2 ">
                                        
                                        <li className="nav-item my-1">
                                            <NavLink to='/home' className="nav-link fw-bolder " >
                                                <span className='me-3 d-none d-sm-inline'> الرئيسية </span>
                                                <i className="bi bi-house-fill "></i>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item my-1">
                                            <NavLink to='orders' className="nav-link  fw-bolder" >
                                                <span className='me-3 d-none d-sm-inline'> الأوردرات </span>
                                                <i className="bi bi-cart-check-fill "></i>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item my-1 ">
                                            <NavLink to='clients' className="nav-link  fw-bolder" >
                                                <span className='me-3 d-none d-sm-inline'> العملاء</span>
                                                <i className="bi bi-people-fill"></i>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item my-1 ">
                                            <NavLink to='salepoints' className="nav-link  fw-bolder" >
                                                <span className='me-3 d-none d-sm-inline'>نقاط البيع</span>
                                                <i className="bi bi-geo-alt-fill"></i>
                                            </NavLink>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                            <div className='border-1 border-bottom border-secondary-50 '></div>

                            <div>
                                <ul className="nav flex-column mt-2">
                                    <li className="nav-item my-1">
                                        <NavLink to='users' className="nav-link  fw-bolder">
                                            <span className='me-3 d-none d-sm-inline'> المستخدمون</span>
                                            <i className="bi bi-file-earmark-person-fill"></i>

                                        </NavLink>
                                    </li>
                                    <li className="nav-item my-1 ">
                                        <NavLink to='settings' className="nav-link  fw-bolder">
                                            <span className='me-3 d-none d-sm-inline'> الإعدادات</span>
                                            <i className="bi bi-gear-wide-connected"></i>
                                        </NavLink>
                                    </li>


                                </ul>
                            </div>
                        </div>
                    </div>

                </nav> : ''}

        </>
    )
}
