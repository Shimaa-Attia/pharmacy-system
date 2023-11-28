import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css'

export default function Sidebar() {
    let openAndClose=()=>{
        alert('helooo')
    }
    return (
        <>
            <nav className={`${styles.sidebar} bg-white  min-vh-100 `}>
                <div className={`side-navs  `} >
                    <a className={`d-block  text-black text-start ps-3  ${styles.sparator}`} onClick={()=>openAndClose()}  style={{ lineHeight: '55px' }} >
                        <i className="bi bi-chevron-left "></i>
                    </a>
                    <div className="nav nav-pills text-end flex-column">
                        <ul className='nav flex-column py-2 '>
                            <li className='nav-item   py-2 '>
                                <NavLink className='text-black '  to='/'  >
                                    <span className='px-5'> <strong>الرئيسية</strong></span>
                                    <i className="bi bi-motherboard pe-2 "></i>
                                </NavLink>
                            </li>
                            <li className='nav-item  py-2' >
                                <Link to='delivery'  className=' text-black' >
                                    <span className='px-5'> <strong>الطيارين</strong></span>
                                    <i className="bi bi-cart3 pe-2 "></i>
                                </Link>
                            </li>
                            <li className={`nav-item  py-2`}>
                                <a >
                                    <span className='px-5'> <strong>العملاء</strong></span>
                                    <i className="bi bi-people-fill pe-2 "></i>
                                </a>
                            </li>
                        </ul>
                        <div className={`${styles.sparator} `}></div>
                        <ul className='nav flex-column py-2 ' >
                            <li className='nav-item  py-2' >
                                <Link className='  text-black' to='users' >
                                    <span className='px-5' > <strong>المستخدمون</strong> </span>
                                    <i className="bi bi-people-fill pe-2 "></i>
                                </Link>
                            </li>
                            <li className='nav-item  py-2' >
                                <a >
                                    <span className='px-5 '> <strong>الإعدادات</strong></span>
                                    <i className="bi bi-gear-wide-connected pe-2 "></i>
                                </a>
                            </li>

                        </ul>
                    </div>
                </div>
             

            </nav>
        </>
        )
}
