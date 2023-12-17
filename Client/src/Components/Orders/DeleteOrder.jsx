import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';

export default function DeleteOrder() {
  let { accessToken } = useContext(AuthContext);

  let { id } = useParams();
  let navigate = useNavigate();
  let [orders, setOrders] = useState([]);
  let getOrder = async () => {
    try {
      let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/show/${id}`);
      setOrders(data.data);

    } catch (error) {
      toast.error('حدث خطأ ما، حاول مرة أخرى')
    }
  };
  useEffect(() => {
    getOrder()
  }, [])
  let DeleteOrder = async () => {
    try {
      axios.delete(`${process.env.REACT_APP_API_URL}/api/orders/delete/${id}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      navigate('/orders')
      toast.success('تم حذف العميل بنجاح');

    } catch (error) {
      toast.error('حدث خطأ ما، حاول مرة أخرى')

    }

  };

  return (
    <>
       <Helmet>
        <meta charSet="utf-8" />
        <title>Delete Order</title>
      </Helmet>
      <h4 className='alert alert-primary m-3 text-center' >هل أنت متأكد من حذف هذا الأوردر؟</h4>
      <div className="card w-75 m-auto p-3 ">
        <div className="row">
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h2 > الاسم : {orders.name} </h2>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3 className='h2' > كود العميل : {orders.code} </h3>
            </div>
          </div>

          {orders.notes ?
            <div className=' col-md-12  ' >
              <div className='text-center rounded p-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
                <h3 className='h2' > ملاحظات  : {orders.notes} </h3>
              </div>
            </div> : ''
          }


        </div>
      </div>


      <div className="col-md-3 d-flex m-auto mt-3 ">
        <NavLink to='../orders' className='btn  btn-secondary form-control mx-2 '>رجوع</NavLink>
        <button className='btn btn-danger form-control mx-2' onClick={DeleteOrder} >حذف العميل</button>
      </div>
    </>
  )
}
