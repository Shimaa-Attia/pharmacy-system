import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthStore';
import axios from 'axios';

export default function Rules() {
  let { accessToken } = useContext(AuthContext);
  let [rules, setRules] = useState([]);

  let [searchText, setSearchText] = useState('');
  function handleSearchChange(event) {
    setSearchText(event.target.value);
  };
  let getOffersData = async () => {
    let searchResult;
    if (searchText !== undefined && searchText.trim().length > 0) {
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/offers/search/${searchText.trim()}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setRules(searchResult.data);

    } else {
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/offers`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      setRules(searchResult.data);

    }
  };
  useEffect(() => {
    getOffersData()
  }, [searchText]);
  return (
    <>
      <div className="container-fluid p-3 ">

        <div className=" my-3 text-center row mx-2  ">
          <div className="col-md-6">
            <input type="text" className='form-control text-end mt-1' onChange={handleSearchChange} placeholder=' ...بحث   ' />
          </div>
          <div className="col-md-6">
            <NavLink to='/rules/add' className='btn btn-primary mb-3' >إضافة تعليمات</NavLink>
          </div>
        </div>
        <div className="card pb-3 ">
          <p className='text-center fw-bold bg-primary-subtle w-25 m-auto rounded p-1 fs-5'>ما يخص الإدارة</p>
          <div>
            قوانين كتيرة كتيرة كتيرة كتيرى
          </div>
        </div>
        <div className="card pb-3 my-3 ">
          <p className='text-center fw-bold bg-primary-subtle w-25 m-auto rounded p-1 fs-5'>ما يخص العملاء</p>
        </div>
        <div className="card pb-3 ">
          <p className='text-center fw-bold bg-primary-subtle w-25 m-auto rounded p-1 fs-5'>ما يخص الزملاء</p>
        </div>
        <div>
          <NavLink to={``} >
            <i className='bi bi-pencil-square fs-4 text-primary'></i>
          </NavLink>
        </div>
      </div>
    </>
  )
}

