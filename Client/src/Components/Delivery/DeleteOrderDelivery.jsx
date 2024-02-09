
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';

export default function DeleteOrderDelivery() {
  let { accessToken } = useContext(AuthContext);
  let { id } = useParams();
  let navigate = useNavigate();
  let [orders, setOrders] = useState([]);
  let [users, setUsers] = useState([]);
  let getOrder = async () => {
try {
  let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/show/${id}`,{
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });
  setOrders(data.data);
} catch (error) {
  toast.error('حدث خطأ ما')
}
  
  };
  useEffect(() => {
    getOrder()
  }, []);
      //get users data to find the id of user to use it in the path to go back
  let getUserData = async () => {
    try {
        let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/auth`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        setUsers(data);
    } catch (error) {
        toast.error('حدث خطأ ما')
    }
};
useEffect(() => {
    getUserData()
}, []);
  let deleteOrder = async () => {
    try {
   let {data}=   axios.delete(`${process.env.REACT_APP_API_URL}/api/orders/delete/${id}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      toast.success('تم حذف الأوردر بنجاح');

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
            <div className='text-center rounded p-2 mt-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h2 > كود الطيار : {orders?.delivery_man?.code} </h2>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 mt-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3 className='h2' > اسم الطيار  : {orders?.delivery_man?.name} </h3>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 mt-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3 className='h2' > كود العميل  : {orders.customer?.code} </h3>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 mt-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3 className='h2' > اسم العميل  : {orders.customer?.name} </h3>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 mt-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3 className='h2' > قيمة الأوردر   : {orders.cost} </h3>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 mt-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3 className='h2' >  إجمالي المبلغ   : {orders.total_ammount} </h3>
            </div>
          </div>
        </div>
      </div>


      <div className="col-md-3 d-flex m-auto mt-3 ">
        <button className='btn btn-danger form-control mx-2' onClick={deleteOrder} >حذف الأوردر</button>
      </div>
    </>
  )
}