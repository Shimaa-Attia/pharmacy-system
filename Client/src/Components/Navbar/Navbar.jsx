import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../Login/Login';
import { Dropdown } from 'react-bootstrap';


export default function Navbar({ userData }) {

  return (
    <>



      {userData ?
        <nav className="navbar navbar-expand-lg bg-primary">
          <div className="container-fluid">
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              <i className='fa fa-bell text-white' ></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-3"> تسجيل خروج</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
