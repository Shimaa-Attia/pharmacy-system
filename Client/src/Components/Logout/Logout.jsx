import axios from 'axios'
import React from 'react'

export default function Logout() {
  let accessToken = localStorage.getItem('userToken');
  let logout = async () => {
    let res = await axios.post(`http://pharma-erp.atomicsoft-eg.com/api/logout` ,{},{
      headers: {
        "Authorization": `Bearer ${accessToken}`
    }
    });
    console.log(res);
  };
  
  return (
    <>
      <h2>logout</h2>
      <button className='btn btn-success' onClick={logout} >تسجيل الخروج</button>
    </>
  )
}

