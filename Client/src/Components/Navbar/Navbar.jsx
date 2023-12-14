import axios from 'axios';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function Navbar({ userData ,setUserData }) {

  let accessToken = localStorage.getItem('userToken');
  let navigate = useNavigate();
  let logout = async () => {
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/api/logout`, {}, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    localStorage.removeItem('userToken');
    setUserData(null);
    toast.success(res.data.message, {
      position: 'top-center'
    });
    navigate('/');

  };

  return (
    <>
      {userData ?
        <nav className="navbar navbar-expand-lg bg-primary">
          <div className="container-fluid">
           
            <div  className='dropdown'>
                <a className="nav-link" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle text-white fs-3"></i>
                </a>
                <ul className="dropdown-menu">

                  <li onClick={logout} ><a className="dropdown-item " > تسجيل خروج</a></li>
                </ul>
          
            </div>
            <button className="navbar-toggler text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon " />
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active text-white fs-6 fw-bold " aria-current="page" to='/home' >Dashboard</Link>
                </li>
              </ul>

            </div>
          </div>
        </nav> : ''
      }

    </>)
}
