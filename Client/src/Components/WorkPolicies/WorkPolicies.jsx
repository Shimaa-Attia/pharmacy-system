
import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthStore';
import axios from 'axios';

export default function WorkPolicies() {
  let { accessToken } = useContext(AuthContext);
  let [salesPolicy, setSalesPolicy] = useState([]);
  let [clientsPolicy, setClientsPolicy] = useState([]);
  let [returnsPolicy, setReturnsPolicy] = useState([]);


  let [searchText, setSearchText] = useState('');
  function handleSearchChange(event) {
    setSearchText(event.target.value);
    if (event.target.value.length === 0) {
      setSearchRuslet([])
    }
  };
  let [searchRuslet, setSearchRuslet] = useState([]);

  let handleSearchData = async () => {
    let searchResult;
    if (searchText !== undefined && searchText.trim().length > 0) {
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/workPolicies/search/${searchText.trim()}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setSearchRuslet(searchResult.data.data);
    }
  }
  useEffect(() => { handleSearchData() }, [searchText])
  let getSalesPolicyData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/workPolicies/sales`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setSalesPolicy(data.data);
  };
  useEffect(() => {
    getSalesPolicyData()
  }, []);
  let getClientsPolicyData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/workPolicies/clients`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setClientsPolicy(data.data);
  };
  useEffect(() => {
    getClientsPolicyData()
  }, []);
  let getReturnsPolicyData = async () => {

    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/workPolicies/returns`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });;
    setReturnsPolicy(data.data);
  };
  useEffect(() => {
    getReturnsPolicyData()
  }, []);
  
  return (
    <>
      <div className="container-fluid p-3 ">

        <div className=" my-3 text-center row mx-2  ">
          <div className="col-md-6">
            <input type="text" className='form-control text-end ' onChange={handleSearchChange} placeholder=' ...بحث   ' />
          </div>
          <div className="col-md-6">
            <NavLink to='/workpolicies/add' className='btn btn-primary mt-1' >إضافة </NavLink>
          </div>
        </div>
        {searchRuslet.length > 0 ? (
          <div>
            {searchRuslet.map((res) => (
              <div key={res.id} className='card p-2 mb-4'>
                <div className='fw-bolder'>{res?.type?.name}:</div>
                <div>{res?.body}</div>
            
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="card pb-3 ">
              <p className='text-center fw-bold bg-primary-subtle  m-auto rounded py-1 px-4 fs-5'>  سياسية المبيعات</p>
              {salesPolicy.map((salePolicy) => (
                <div key={salePolicy.id}>
                  <div className='p-2'>
                    {salePolicy?.body}
                    <NavLink to={`/workpolicies/edite/${salePolicy.id}`}>
                      <i className='bi bi-pencil-square mx-4 text-primary fs-5'></i>
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
            <div className="card pb-3 my-3 ">
              <p className='text-center fw-bold bg-primary-subtle  m-auto rounded py-1 px-4 fs-5'>سياسية التعامل مع العملاء</p>
              {clientsPolicy.map((clientPolicy) => (
                <div key={clientPolicy.id}>
                  <div className='p-2'>
                    {clientPolicy?.body}
                    <NavLink to={`/workpolicies/edite/${clientPolicy.id}`}>
                      <i className='bi bi-pencil-square mx-4 text-primary fs-5'></i>
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
            <div className="card pb-3  ">
              <p className='text-center fw-bold bg-primary-subtle m-auto rounded py-1 px-4 fs-5'>سياسية المرتجعات</p>
              {returnsPolicy.map((returnPolicy) => (
                <div key={returnPolicy.id}>
                  <div className='p-2'>
                    {returnPolicy?.body}
                    <NavLink to={`/workpolicies/edite/${returnPolicy.id}`}>
                      <i className='bi bi-pencil-square mx-4 text-primary fs-5'></i>
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
         
          </>
        )}
      </div>
    </>
  )
}


