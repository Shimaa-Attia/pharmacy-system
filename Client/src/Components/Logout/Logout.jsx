import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Logout({ userData, setUserData }) {


  let accessToken = localStorage.getItem('userToken');
  let navigate = useNavigate();
  let logout = async () => {
    let res = await axios.post(`http://pharma-erp.atomicsoft-eg.com/api/logout`, {}, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    localStorage.removeItem('userToken');
    // setUserData(null);
    toast.success(res.data.message, {
      position: 'top-center'
    });


    navigate('/');

  };

  return (
    <>

      <button className='btn btn-success' onClick={logout} >تسجيل الخروج</button>
    </>
  )
}

