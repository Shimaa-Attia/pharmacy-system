import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';

export default function Login({ saveUserData }) {


 let {loginDeliveryData} = useContext(AuthContext);
  let navigate = useNavigate();
  let [isLoading, setIsLoading] = useState(false);
  let [users, setUsers] = useState({
    phone: '',
    password: '',
  });


  let getInputValue = (event) => {
    let myUsers = { ...users }; //deep copy
    myUsers[event.target.name] = event.target.value;
    setUsers(myUsers)
  };

  let validateLoginFrom = () => {
    const schema = Joi.object({
      phone: Joi.string().required().pattern(/^01[0125][0-9]{8}$/).messages({
        "string.pattern.base": `رقم الهاتف غير صحيح`,
        "any.required": `"" phone required`,
      }),
      password: Joi.string().required(),

    });
    return schema.validate(users, { abortEarly: false });
  };

  let sendLoginDataToApi = async () => {
    let { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, users);
    if (data.message == 'تم تسجيل دخولك بنجاح') {
      setIsLoading(false);
      localStorage.setItem('userToken', data.token);
      saveUserData();
      toast.success(data.message, {
        position: 'top-center',

      });
    
      navigate('home');
    } else {
      setIsLoading(false);
      try {
        toast.error(data.message, {
          position: 'bottom-center'
        });
      } catch (error) {
        toast.error("حدث خطأ ما عند تسجيل الدخول");
      }

    };
  };


  let submitLoginForm = (e) => {
    setIsLoading(true);
    e.preventDefault();
    let validation = validateLoginFrom();
    if (!validation.error) {
      sendLoginDataToApi();
    }
    else {
      setIsLoading(false);
      try {
        validation.error.details.map((err) => {
          toast.error(err.message);
        })
      } catch (e) {
        toast.error("حدث خطأ ما عند تسجيل الدخول");
      }
    }
  };
  return (
    <>
       <Helmet>
        <meta charSet="utf-8" />
        <title>Login</title>
      </Helmet>

      <div className="container m-auto   pt-5 ">
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
