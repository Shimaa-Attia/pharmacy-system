import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthStore';
import axios from 'axios';

export default function Rules() {
  let { accessToken } = useContext(AuthContext);
  let [managmentRules, setManagmentRules] = useState([]);
  let [clientsRules, setClientsRules] = useState([]);
  let [colleaguesRules, setColleaguesRules] = useState([]);

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
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/rules/search/${searchText.trim()}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setSearchRuslet(searchResult.data.data);
    }
  }
  useEffect(() => { handleSearchData() }, [searchText])
  let getMangmentRulesData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/rules/الإدارة`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });;
    setManagmentRules(data.data);
  };
  useEffect(() => {
    getMangmentRulesData()
  }, []);
  let getClientsRulesData = async () => {

    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/rules/العملاء`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });;
    setClientsRules(data.data);
  };
  useEffect(() => {
    getClientsRulesData()
  }, []);
  let getColleaguesRulesData = async () => {

    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/rules/الزملاء`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });;
    setColleaguesRules(data.data);
  };
  useEffect(() => {
    getColleaguesRulesData()
  }, []);
  return (
    <>
      <div className="container-fluid p-3 ">

        <div className=" my-3 text-center row mx-2  ">
          <div className="col-md-6">
            <input type="text" className='form-control text-end ' onChange={handleSearchChange} placeholder=' ...بحث   ' />
          </div>
          <div className="col-md-6">
            <NavLink to='/rules/add' className='btn btn-primary mt-1' >إضافة تعليمات</NavLink>
          </div>
        </div>
        {/* {searchRuslet.length > 0 && <div>
          {searchRuslet.map((res) => <div key={res.id} className='card p-2 mb-4'>
            {res.body}
          </div>)}
        </div>}
        <div className="card pb-3 ">
          <p className='text-center fw-bold bg-primary-subtle  m-auto rounded py-1 px-4 fs-5'>ما يخص الإدارة</p>
          {managmentRules.map((mangRule) => <div key={mangRule.id}>
            <div className='p-2'>
              {mangRule.body}
              <NavLink to={`/rules/edite/${mangRule.id}`}>
                <i className='bi bi-pencil-square mx-4 text-primary fs-5'></i>
              </NavLink>
            </div>


          </div>)}
        </div>
        <div className="card pb-3 my-3 ">
          <p className='text-center fw-bold bg-primary-subtle  m-auto rounded py-1 px-4 fs-5'>ما يخص العملاء</p>
          {clientsRules.map((clientRule) => <div key={clientRule.id}>
            <div className='p-2'>
              {clientRule.body}
              <NavLink to={`/rules/edite/${clientRule.id}`}>
                <i className='bi bi-pencil-square mx-4 text-primary fs-5'></i>
              </NavLink>            </div>
          </div>)}
        </div>
        <div className="card pb-3 ">
          <p className='text-center fw-bold bg-primary-subtle m-auto rounded py-1 px-4 fs-5'>ما يخص الزملاء</p>
          {colleaguesRules.map((colleRule) => <div key={colleRule.id}>
            <div className='p-2'>
              {colleRule.body}
              <NavLink to={`/rules/edite/${colleRule.id}`}>
                <i className='bi bi-pencil-square mx-4 text-primary fs-5'></i>
              </NavLink>            </div>
          </div>)}
        </div>
        <div>
        </div> */}
        {searchRuslet.length > 0 ? (
          <div>
            {searchRuslet.map((res) => (
              <div key={res.id} className='card p-2 mb-4'>
                {res.body}
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="card pb-3 ">
              <p className='text-center fw-bold bg-primary-subtle  m-auto rounded py-1 px-4 fs-5'>ما يخص الإدارة</p>
              {managmentRules.map((mangRule) => (
                <div key={mangRule.id}>
                  <div className='p-2'>
                    {mangRule.body}
                    <NavLink to={`/rules/edite/${mangRule.id}`}>
                      <i className='bi bi-pencil-square mx-4 text-primary fs-5'></i>
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
            <div className="card pb-3 my-3 ">
              <p className='text-center fw-bold bg-primary-subtle  m-auto rounded py-1 px-4 fs-5'>ما يخص العملاء</p>
              {clientsRules.map((clientRule) => (
                <div key={clientRule.id}>
                  <div className='p-2'>
                    {clientRule.body}
                    <NavLink to={`/rules/edite/${clientRule.id}`}>
                      <i className='bi bi-pencil-square mx-4 text-primary fs-5'></i>
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
            <div className="card pb-3 ">
              <p className='text-center fw-bold bg-primary-subtle m-auto rounded py-1 px-4 fs-5'>ما يخص الزملاء</p>
              {colleaguesRules.map((colleRule) => (
                <div key={colleRule.id}>
                  <div className='p-2'>
                    {colleRule.body}
                    <NavLink to={`/rules/edite/${colleRule.id}`}>
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

