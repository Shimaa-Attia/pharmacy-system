import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { AuthContext } from '../../Context/AuthStore';
import { toast } from 'react-toastify';
import Joi from 'joi';


export default function Home() {
  let { accessToken } = useContext(AuthContext);

  let [anyDate, setAnyDate] = useState({
    start_date: '',
    end_date: ''
  })
  let getInputValue = (event) => {
    let myDate = { ...anyDate };
    myDate[event?.target?.name] = event?.target?.value;
    setAnyDate(myDate);
    console.log(myDate);
  }
  let sendDateToApi = async () => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/users/specificOrders/9`, anyDate, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      console.log(res);
      toast.success(res.data.message);

    }).catch((errors) => {
      console.log(errors.response);
      toast.error(errors.response?.data?.message)
      // const errorList = errors?.response?.data?.message;
      // if (errorList !== undefined) {
      //   Object.keys(errorList).map((err) => {
      //     errorList[err].map((err) => {
      //       toast.error(err);
      //     })
      //   });
        
      // } else {
      //   toast.error("حدث خطأ ما");
      // }
    })
  }
  let validateDateForm = () => {
    const schema = Joi.object({
      start_date: Joi.string().required(),
      end_date: Joi.string().required(),
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
      <div className='container  w-75  my-4' >
        <div className='alert text-center fs-4 text-white ' style={{ backgroundColor: 'rgb(100, 100, 128)' }} >تفاصيل وأعداد الأوردرات</div>
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
              <button type='submit' className='btn btn-secondary ' >بحث...</button>
            </div>
          </div>
        </form>
        <div className="row" >
          <div className="col-md-4 ">
            <div className="card">عدد الأوردرات </div>
          </div>
          <div className="col-md-4">
            <div className="card">عدد الأوردرات </div>

          </div>
          <div className="col-md-4">
            <div className="card">عدد الأوردرات </div>


          </div>
        </div>
      </div>




    </>)
}
