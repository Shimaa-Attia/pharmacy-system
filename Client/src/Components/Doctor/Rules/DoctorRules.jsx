
import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../../Context/AuthStore';
import axios from 'axios';

export default function DoctorRules() {
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
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/rules/management`, {
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

    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/rules/clients`, {
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

    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/rules/colleagues`, {
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


        <div className=" text-center  mb-4">              
            <NavLink to='/doctorworkpolicies' className='btn  btn-secondary mt-1' >سياسة العمل </NavLink>  
        </div>
   
            <div className="card pb-3 ">
              <p className='text-center fw-bold bg-primary-subtle  m-auto rounded py-1 px-4 fs-5'>ما يخص الإدارة</p>
              {managmentRules.map((mangRule) => (
                <div key={mangRule.id}>
                  <div className='p-2'>
                    {mangRule.body}
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
                  </div>
                </div>
              ))}
            </div>
      </div>
    </>
  )
}

