import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { AuthContext } from '../../Context/AuthStore';


export default function Sidebar() {
    let { userData } = useContext(AuthContext);
    let [clientSubmenuOpen, setClientSubmenuOpen] = useState(false);
    let toggleClientSubmenu = () => {
        setClientSubmenuOpen(!clientSubmenuOpen);
    }
    let [managementSubmenuOpen, setManagementSubmenuOpen] = useState(false);
    let toggleManagementSubmenu = () => {
        setManagementSubmenuOpen(!managementSubmenuOpen);
    }

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

                                        <li className="nav-item ">
                                            <NavLink to='/home' className="nav-link fw-bolder " >
                                                <span className='me-3 d-none d-sm-inline'> الرئيسية </span>
                                                <i className="bi bi-house-fill "></i>
                                            </NavLink>
                                        </li>

                                        <li className="nav-item">
                                            <NavLink to='orders' className="nav-link  fw-bolder" >
                                                <span className='me-3 d-none d-sm-inline'> الأوردرات </span>
                                                <i className="bi bi-cart-check-fill "></i>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item ">
                                            <NavLink to='inventoryproducts' className="nav-link  fw-bolder" >
                                                <span className='me-3 d-none d-sm-inline'> الجرد </span>
                                                <i className="bi bi-receipt-cutoff"></i>                                            </NavLink>
                                        </li>
                                        <li className="nav-item  ">
                                            <div onClick={toggleClientSubmenu} className="nav-link fw-bolder">
                                                <span className='me-3 d-none d-sm-inline'>العملاء</span>
                                                <i className={clientSubmenuOpen ? "bi bi-caret-up-fill" : "bi bi-caret-down-fill"}></i>
                                            </div>
                                            {clientSubmenuOpen &&
                                                <div>
                                                    <NavLink to='clients' className="nav-link me-4 fw-bolder" >
                                                        <span className='me-3 d-none d-sm-inline'>بيانات العملاء</span>
                                                        <i className="bi bi-people-fill "></i>
                                                    </NavLink>

                                                    <NavLink to='customersservice' className="nav-link me-4 fw-bolder" >
                                                        <span className='me-3 d-none d-sm-inline '>خدمة العملاء </span>
                                                        <i className="bi bi-telephone-outbound-fill "></i>
                                                    </NavLink>
                                                </div>
                                            }

                                        </li>
                               
                                        <li className="nav-item">
                                            <NavLink to='/offers' className="nav-link fw-bolder " >
                                                <span className='me-3 d-none d-sm-inline'> العروض </span>
                                                <i className="bi bi-basket2"></i>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item ">
                                            <NavLink to='companies' className="nav-link  fw-bolder" >
                                                <span className='me-3 d-none d-sm-inline'>الشركات </span>
                                                <i className="bi bi-border-style"></i>
                                            </NavLink>
                                        </li>


                                    </ul>
                                </div>
                            </div>
                            <div className='border-1 border-bottom border-secondary-50 '></div>

                            <div>
                                <ul className="nav flex-column mt-2">
                                <li className="nav-item  ">
                                            <NavLink to='salepoints' className="nav-link  fw-bolder" >
                                                <span className='me-3 d-none d-sm-inline'>نقاط البيع</span>
                                                <i className="bi bi-person-fill-add"></i>                                            </NavLink>
                                        </li>
                                    <li className="nav-item">
                                        <NavLink to='/branches' className="nav-link  fw-bolder">
                                            <span className='me-3 d-none d-sm-inline'> الفروع</span>
                                            <i className="bi bi-geo-alt-fill"></i>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to='purchases' className="nav-link  fw-bolder">
                                            <span className='me-3 d-none d-sm-inline'> المشتريات</span>
                                            <i className="bi bi-bag-fill"></i>

                                        </NavLink>
                                    </li>

                                    <li className="nav-item ">
                                        <div onClick={toggleManagementSubmenu} className="nav-link fw-bolder">
                                            <span className='me-3 d-none d-sm-inline'>الإدارة</span>
                                            <i className={managementSubmenuOpen ? "bi bi-caret-up-fill" : "bi bi-caret-down-fill"}></i>
                                        </div>
                                        {managementSubmenuOpen &&
                                            <div>
                                                <NavLink to='/rules' className="nav-link me-4 fw-bolder" >
                                                    <span className='me-3 d-none d-sm-inline '>التعليمات</span>
                                                    <i className="bi bi-book-fill "></i>
                                                </NavLink>
                                                <NavLink to='users' className="nav-link me-4 fw-bolder">
                                                    <span className='me-3 d-none d-sm-inline'> المستخدمون</span>
                                                    <i className="bi bi-file-earmark-person-fill"></i>

                                                </NavLink>
                                            </div>
                                        }
                                    </li>


                                </ul>
                            </div>
                        </div>
                    </div>

                </nav> : ''}

        </>
    )
}
