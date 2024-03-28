
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../Context/AuthStore';
import axios from 'axios';

export default function DoctorWorkPolicies() {
  let { accessToken } = useContext(AuthContext);
  let [salesPolicy, setSalesPolicy] = useState([]);
  let [returnsPolicy, setReturnsPolicy] = useState([]);

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
       
            <div className="card pb-3 my-2 ">
              <p className='text-center fw-bold bg-primary-subtle  m-auto rounded py-1 px-4 fs-5'>  سياسية المبيعات</p>
              {salesPolicy.map((salePolicy) => (
                <div key={salePolicy.id}>
                  <div className='p-2'>
                    {salePolicy?.body}
                   
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
                    
                  </div>
                </div>
              ))}
            </div>
         
          
       
      </div>
    </>
  )
}


