import React, { useContext } from 'react'
import { AuthContext } from '../../Context/AuthStore';
import { NavLink } from 'react-router-dom';

export default function DeliveryNavbar() {
    let { logout, userData } = useContext(AuthContext);
    return (
        <>

        {userData ?  <nav className="navbar navbar-expand-lg bg-primary">
                <div className="container">
                    <div className='dropdown'>
                        <a className="nav-link" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-person-circle text-white fs-3"></i>
                        </a>
                        <ul className="dropdown-menu">

                            <NavLink to='/' onClick={logout} className="dropdown-item " > تسجيل خروج</NavLink>
                        </ul>

                    </div>
                    <button className="navbar-toggler text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon " />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link active text-white fs-6 fw-bold " aria-current="page" to='/deliverylayout' >الأوردرات</NavLink>
                            </li>
                        </ul>

                    </div>
                </div>
            </nav> :'' }
          
           
        </>
    )
}