
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';

export default function Companies() {
  let { accessToken } = useContext(AuthContext);
  let [companies, setCompanies] = useState([]);

  let [searchText, setSearchText] = useState('');
  function handleSearchChange(event) {
    setSearchText(event.target.value);
  
  };
  let getCompaniesData = async () => {
    let searchResult;
    if (searchText !== undefined && searchText.trim().length > 0) {
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies/search/${searchText.trim()}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setCompanies(searchResult.data);

    } else {

      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setCompanies(searchResult.data);

    }

  };
  useEffect(() => {
    getCompaniesData()
  }, [searchText]);

  let showCompaies = () => {
    if (companies.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive">
       
        
              <div className="row " dir='rtl' >
          {companies.map((company) => <div key={company.id} className='col-md-3 my-2  text-center '>
            <div className=' card p-1'>
              <div className='bg-secondary-subtle rounded' >{company?.name}</div>
                <div className='bg-secondary-subtle rounded my-1 ' >{company?.phoneNumber ? company.phoneNumber :'...'}</div>
                <div className='bg-secondary-subtle rounded' >{company?.TaxCard ? company.TaxCard :'...'}</div>
                <div className='bg-secondary-subtle rounded my-1' >{company?.entryInstructions ? company.entryInstructions :'...'}</div>
                <div className='bg-secondary-subtle rounded my-1' >{company?.notes ? company.notes :'...'}</div>
              <div>
                <NavLink to={`/companies/edite/${company.id}`} >
                <i className='bi bi-pencil-square fs-4 text-primary'></i>
                </NavLink>
              </div>
              </div>


              </div>)}
            </div>
        </div>
      )
    } else {
      return (
        <div className=' d-flex justify-content-center  height-calc-70 align-items-center' >
          {companies.length <= 0 && searchText.length <= 0 ?
            <i className='fa fa-spinner fa-spin  fa-5x'></i>
            : <div className='alert alert-danger w-50 text-center'>لا يوجد شركات</div>
          }
        </div>
      )
    }
  };

  return (

    <>
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Offers</title>
        </Helmet>
        <div className=" my-3 text-center row mx-2  ">
          <div className="col-md-6">
            <NavLink to='/companies/add' className='btn btn-primary mb-1' >إضافة شركة</NavLink>
          </div>
          <div className="col-md-4">
            <input type="text" className='form-control text-end mt-1' onChange={handleSearchChange} placeholder=' ...بحث عن شركة ' />
          </div>
        </div>
      </>

{showCompaies()}
      
    </>)
}
