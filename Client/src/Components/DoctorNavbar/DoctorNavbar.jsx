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
                    <button className="navbar-toggler text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon " />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link active text-white fs-6 fw-bold " aria-current="page" to={`/doctorlayout/doctorOrders/${users.id}`} >الأوردرات</NavLink>
                            </li>
                        </ul>

                    </div>
                </div>
            </nav> : ''}


        </>
    )
}
