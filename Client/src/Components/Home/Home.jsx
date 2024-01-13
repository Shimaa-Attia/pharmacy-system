import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { AuthContext } from '../../Context/AuthStore';
import { toast } from 'react-toastify';
import Joi from 'joi';
import { NavLink } from 'react-router-dom';


export default function Home() {
  let { accessToken } = useContext(AuthContext);
  let [anyDate, setAnyDate] = useState({
    start_date: '',
    end_date: ''
  })
  let [ordersNumbers, setOrdersNumbers] = useState('');
  let [users, setUsers] = useState([]);
  let getInputValue = (event) => {
    let myDate = { ...anyDate };
    myDate[event?.target?.name] = event?.target?.value;
    setAnyDate(myDate);
  }
  let sendDateToApi = async () => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/orders/specificOrders`, anyDate, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      setOrdersNumbers(res?.data?.totalNumOfOrders);
      setUsers(res?.data?.users);
    }).catch((errors) => {
      const errorList = errors?.response?.data?.message;
      if (errorList !== undefined) {
          Object.keys(errorList)?.map((err) => {
              errorList[err]?.map((err) => {
                  toast.error(err);
              })
          });
      } else {
          toast.error("حدث خطأ ما");
      }
    })
  }
  let validateDateForm = () => {
    const schema = Joi.object({
      start_date: Joi.date().required().messages({
        "date.base": `تاريخ البداية مطلوب`,
      }),
      end_date: Joi.date().required().messages({
        "date.base": `تاريخ النهاية مطلوب`,
      }),
    });
    return schema.validate(anyDate, { abortEarly: false });
  };
  let submitDateForm = (e) => {
    e.preventDefault();
    let validation = validateDateForm();
    if (!validation.error) {
      sendDateToApi()
    } else {
      try {
        validation.error.details.map((err) => {
          toast.error(err.message);
        })
      } catch (e) {
        toast.error("حدث خطأ ما");
      }
    }
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home</title>
      </Helmet>
      <div className='container my-4' >
        <div>
        <NavLink to='/shortcomings' className='btn  btn-danger mt-2 mb-4'>إضافة النواقص</NavLink>
        </div>
        {/* <div className='alert text-center fs-4 text-white ' style={{ backgroundColor: 'rgb(100, 100, 128)' }} > إحصائيات </div> */}
        <form onSubmit={submitDateForm}>
          <div className=' row' dir='rtl' >
            <div className='col-md-4' >
              <label htmlFor="start_date" className='form-label'>من يوم</label>
              <input type="date" name="start_date" id="start_date" className='form-control mb-2' onChange={getInputValue} />
            </div>
            <div className='col-md-4'>
              <label htmlFor="end_date" className='form-label'> إلى يوم</label>
              <input type="date" name="end_date" id="end_date" className='form-control mb-3' onChange={getInputValue} />
            </div>
            <div className='mb-3'>
              <button type='submit' className='btn btn-secondary' >بحث...</button>
            </div>
          </div>
        </form>
        <div>
          {ordersNumbers ?
            <div className="col-md-3 card text-center   m-auto py-4">
              <div className='fs-1' >{ordersNumbers}</div>
              <span className=" lead ">عدد الأوردرات</span>
            </div>
            : ''}
        </div>
        <div className="row " dir='rtl' >
          {users.map((user) => <div key={user.user_id} className='col-md-3 m-auto my-2  text-center '>
            <div className=' card p-1'>
              <div className='bg-secondary-subtle rounded' >{user?.user_name}</div>
                <div className='bg-secondary-subtle rounded my-1 ' >{user?.user_code}</div>
                <div className='bg-secondary-subtle rounded' >{user?.user_role}</div>
                <div className='fs-2' >{user?.numOfOrders}</div>
                <div className=" lead">عدد الأوردرات</div>
              </div>


              </div>)}
            </div>
          </div>
    </>)
}
