
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';



export default function Navbar() {
  let { userName, userData, logout } = useContext(AuthContext);
  return (
    <>
      {userData ?
        <nav className="navbar navbar-expand-lg bg-primary">
          <div className="container-fluid ">
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
            <button className="navbar-toggler text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon " />
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link  text-white fs-6 fw-bold " aria-current="page" to='/home' >Dashboard</Link>
                </li>
              </ul>

            </div>
          </div>
        </nav> : ''
      }

    </>)
}
