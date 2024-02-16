import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';
import axios from 'axios';

export default function DoctorNavbar() {
    let { logout, userData, accessToken, userName } = useContext(AuthContext);
    let [users, setUsers] = useState([]);
    let getUserData = async () => {
        let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/auth`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        setUsers(data);
    };
    useEffect(() => {
        getUserData()
    }, []);
    return (
        <>

            {userData ? <nav className="navbar navbar-expand-lg bg-primary">
                <div className="container">

                    <div className="d-flex" >
                        <div className='dropdown'>
                            <a className="nav-link fs-3 " data-bs-toggle="dropdown" aria-expanded="false" style={{ lineHeight: 'px' }}>
                                <i className="bi bi-person-circle text-white "></i>
                            </a>
                            <ul className="dropdown-menu">
                                <li onClick={logout}><a className="dropdown-item " > تسجيل خروج</a></li>
                            </ul>
                        </div>
                        <span className='text-white mt-1 ms-2 fs-5 d-inline-block' >{userName}</span>
                    </div>
                    <button className="navbar-toggler text-white mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon  " />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link  text-white fs-6 fw-bold " aria-current="page" to={`/doctorrules`} >قواعد العمل</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link  text-white fs-6 fw-bold " aria-current="page" to={`/doctorsellingincentives`} >حوافز البيع</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link  text-white fs-6 fw-bold " aria-current="page" to={`/doctorinventoryproducts`} >الجرد</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link  text-white fs-6 fw-bold " aria-current="page" to={`/doctornotifications`} >الإشعارات</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link  text-white fs-6 fw-bold " aria-current="page" to={`/doctoroffers`} >العروض</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link  text-white fs-6 fw-bold " aria-current="page" to={`/doctorcustomerservice`} >خدمة العملاء</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link  text-white fs-6 fw-bold " aria-current="page" to={`/doctorpurchases`} >المشتريات</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link  text-white fs-6 fw-bold " aria-current="page" to={`/doctorOrders/${users.id}`} >الأوردرات</NavLink>
                            </li>
                        </ul>

                    </div>
                </div>
            </nav> : ''}


        </>
    )
}
