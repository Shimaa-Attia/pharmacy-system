
import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../../Context/AuthStore';
import axios from 'axios';

export default function DeliveryRules() {
  let { accessToken } = useContext(AuthContext);
  let [deliveryRules, setDeliveryRules] = useState([]);
  let getDeliveryRulesData = async () => {

    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/rules/delivery`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });;
    setDeliveryRules(data.data);
  };
  useEffect(() => {
    getDeliveryRulesData()
  }, []);
  return (
    <>
      <div className="container-fluid p-3 ">         
            <div className="card pb-3 my-3 ">
              <p className='text-center fw-bold bg-primary-subtle m-auto rounded py-1 px-4 fs-5'>ما يخص الطيارين</p>
              {deliveryRules.map((delivRule) => (
                <div key={delivRule.id}>
                  <div className='p-2'>
                    {delivRule?.body}
                    <NavLink to={`/rules/edite/${delivRule.id}`}>
                      <i className='bi bi-pencil-square mx-4 text-primary fs-5'></i>
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
      </div>
    </>
  )
}

