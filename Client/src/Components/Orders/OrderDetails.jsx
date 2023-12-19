import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { AuthContext } from '../../Context/AuthStore';
import axios from 'axios';
import { NavLink, useParams } from 'react-router-dom';


export default function OrderDetails() {
  let { accessToken } = useContext(AuthContext);
  let { id } = useParams();
  let [orders, setOrders] = useState([]);
  let getOrder = async () => {

    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/show/${id}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setOrders(data.data);

  };
  useEffect(() => {
    getOrder()
  }, []);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Order Details</title>
      </Helmet>
      <h4 className='alert alert-primary m-3 text-center' >  تفاصيل الأوردر</h4>
      <div className="card w-75 m-auto p-3 ">
        <div className="row">
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h2 > كود الطيار : {orders?.delivery_man?.code} </h2>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3 className='h2' > اسم الطيار  : {orders?.delivery_man?.name} </h3>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 my-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3 className='h2' > كود العميل  : {orders?.customer?.code} </h3>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 my-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3 className='h2' > اسم العميل  : {orders?.customer?.name} </h3>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 my-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3 className='h2' > هاتف العميل   : {orders?.customer_phone} </h3>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 my-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3 className='h2' > عنوان العميل    : {orders?.customer_address} </h3>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 my-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3 className='h2' > قيمة الأوردر   : {orders?.cost} </h3>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 my-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3 className='h2' >  إجمالي المبلغ   : {orders.total_ammount} </h3>
            </div>
          </div>
          {orders.notes ?
            <div className='col-md-12 ' >
              <div className="text-center rounded p-2 my-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }}>
                <h5 className='h3' > ملاحظات : {orders?.notes}</h5>
              </div>
            </div> : ''
          }
        </div>
      </div>


      <div className="col-md-3 d-flex m-auto mt-3 ">
        <NavLink to='../orders' className='btn  btn-secondary form-control mx-2 '>رجوع</NavLink>
      </div>
    </>
  )
}
