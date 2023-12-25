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
  let [ordersNumbers , setOrdersNumbers] = useState('')
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
      setOrdersNumbers(res.data.numOfOrders);
     
    }).catch((errors) => {
      toast.error(errors.response?.data?.message);
    
    })
  }
  let validateDateForm = () => {
    const schema = Joi.object({
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
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
        <div className='alert text-center fs-4 text-white ' style={{ backgroundColor: 'rgb(100, 100, 128)' }} > أعداد الأوردرات</div>
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
        {ordersNumbers ?  <div className="row" dir='rtl' >
          <div className="col-md-3 card text-center py-3 ">
            <div className='fs-1' >{ordersNumbers}</div>
            <span className=" lead ">أوردر</span>
          </div>
         
        </div> :''}
       
      </div>




    </>)
}
