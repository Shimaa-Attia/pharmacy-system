import axios from 'axios';
import Joi from 'joi';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


export default function Login({ saveUserData }) {
  let navigate = useNavigate();
  let [loginSuccess, setLoginSuccess] = useState('');
  let [errorMsg, setErrorMsg] = useState('');
  let [errorList, setErrorList] = useState([]);
  let [isLoading, setIsLoading] = useState(false);

  let [users, setUsers] = useState({
    phone: '',
    password: '',
  });

  let getInputValue = (event) => {
    let myUsers = { ...users }; //deep copy
    myUsers[event.target.name] = event.target.value;
    setUsers(myUsers)
  }

  let validateLoginFrom = () => {
    const schema = Joi.object({
      phone: Joi.string().required().pattern(/^01[0125][0-9]{8}$/),
      password: Joi.string().required(),

    });
    return schema.validate(users, { abortEarly: false });
  }

  let sendLoginDataToApi = async () => {
    await axios.post(`http://127.0.0.1:8000/api/login`, users).then((res) => {
      localStorage.setItem('userToken', res.data.token);
      saveUserData();
      setIsLoading(false);
      setLoginSuccess(res.data.message);
      console.log(loginSuccess);
      console.log(res.data.message + 'hello');
      navigate('home');

    }).catch((errors) => {
      console.log(errors);
      setIsLoading(false);
      setErrorMsg(errors.response.data.message);
      console.log(errorMsg);

    });
  }

  let submitLoginForm = (e) => {
    setIsLoading(true);
    e.preventDefault();
    let validation = validateLoginFrom();
    if (validation.error) {
      setIsLoading(false);
      setErrorList(validation.error.details);

    } else {
      sendLoginDataToApi();
    }
  }
  return (
    <>
      <div className="container m-auto   pt-5 ">
        {errorList.map((err, index) => <div key={index} className='alert alert-danger' >{err.message}</div>)}

        <div className="logo text-center py-3">
          <img src="" alt="logo" className='w-100' />
        </div>
        <div className="w-50 m-auto">
          <form onSubmit={submitLoginForm} >
            <div className="input-data pb-4">
              <label htmlFor="phone" className='form-label'>رقم الهاتف</label>
              <input type="tel" className='form-control' name="phone" id="phone" onChange={getInputValue} />
            </div>
            <div className="input-data">
              <label htmlFor="password" className='form-label'>كلمة السر</label>
              <input type="password" className='form-control' name="password" id="password" onChange={getInputValue} />
            </div>
            <div className=' text-center' >

              <button className='btn btn-primary mt-4' >
                {isLoading == true ? <i className=' fa fa-spinner fa-spin'></i> : 'تسجيل الدخول'}
              </button>
            </div>
          </form>
        </div>


      </div>
    </>
  )
}
