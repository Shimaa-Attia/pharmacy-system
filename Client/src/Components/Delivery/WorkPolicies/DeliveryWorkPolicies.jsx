
import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../../Context/AuthStore';
import axios from 'axios';

export default function DeliveryWorkPolicies() {
  let { accessToken } = useContext(AuthContext);
  let [clientsPolicy, setClientsPolicy] = useState([]);


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
 
  
  return (
    <>
      <div className="container-fluid p-3 ">

      
     
         
         
            <div className="card pb-3 my-3 ">
              <p className='text-center fw-bold bg-primary-subtle  m-auto rounded py-1 px-4 fs-5'>سياسية التعامل مع العملاء</p>
              {clientsPolicy.map((clientPolicy) => (
                <div key={clientPolicy.id}>
                  <div className='p-2'>
                    {clientPolicy?.body}
                   
                  </div>
                </div>
              ))}
            </div>
           
        
      </div>
    </>
  )
}




