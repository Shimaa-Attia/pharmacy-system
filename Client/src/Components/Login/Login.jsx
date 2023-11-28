import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Login() {
  let navigate = useNavigate();
  let [users, setUsers] = useState({ 
    phone: '',
    password: '',
  
  });

  let getInputValue = (event) => {
    let myUsers = { ...users }; //deep copy
    myUsers[event.target.name] = event.target.value;
    setUsers(myUsers)
    console.log(myUsers);

  }
  let submitLogin = (e) => {
    e.preventDefault();
    alert('submitttttt')
  }
  return (
    <>
      <div className="container m-auto   pt-5 ">

        <div className="logo text-center py-3">
          <img src="" alt="logo" className='w-100' />
        </div>
        <div className="w-50 m-auto">
          <form onSubmit={submitLogin} >
            <div className="input-data pb-4">
              <label htmlFor="phoneNumber" className='form-label'>رقم الهاتف</label>
              <input type="tel" className='form-control' name="phoneNumber" id="phoneNumber" onChange={getInputValue} />
            </div>
            <div className="input-data">
              <label htmlFor="password" className='form-label'>كلمة السر</label>
              <input type="password" className='form-control' name="password" id="password" onChange={getInputValue} />
            </div>
            <div className=' text-center' >

              <button className='btn btn-primary mt-4' >تسجيل الدخول</button>
            </div>
          </form>
        </div>


      </div>
    </>
  )
}
