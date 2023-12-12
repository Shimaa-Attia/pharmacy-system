import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

export default function Orders() {
  let accessToken = localStorage.getItem('userToken');
  let [orders , setOrders] = useState([]);
  let [users , setUsers] = useState([]);

  // let getUserData = async () => {
  //   let { data } = await axios.get(`http://127.0.0.1:8000/api/users`);
  //   setUsers(data.data);
   
  // };
  // useEffect(() => {
  //    getUserData() 
  //   }, []);

  let getOrderData = async () => {
    let { data } = await axios.get(`http://127.0.0.1:8000/api/orders`,{
      headers: {
        "Authorization": `Bearer ${accessToken}`
    }
    });
    // console.log(data);
    setOrders(data.data);
  };
  useEffect(() => { getOrderData() }, []);

  let showOrders = () => {
    if (orders.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 ">
          <table className='table table-bordered table-hover text-center '>
            <thead>
              <tr>
                <th>خيارات</th>
                <th>كود العميل</th>
                <th>هاتف الطيار</th>
                <th>اسم الطيار</th>
                <th>كود الطيار</th>
                <th>رقم</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order , index) => <tr key={order.id}>
                <td>
                  <NavLink to={`/orders/delete/${order.id}`} >
                  <i className='bi bi-trash text-bg-danger p-1 mx-1 rounded'></i>
                  </NavLink>
                  <NavLink to={`/orders/edite/${order.id}`} >
                  <i className='bi bi-pencil-square text-bg-primary mx-1 p-1 rounded'></i>
                  </NavLink>
                  <NavLink to={`/orders/details/${order.id}`} >
                  <i className='bi bi-list-ul text-bg-success mx-1 p-1 rounded'></i>
                  </NavLink>
                </td>
                <td>{order.phone}</td>
                <td>{order.role}</td>
                <td>{order.name}</td>
                <td>{order.code}</td>
                <td>{++index}</td>  
              </tr>
              )}
            </tbody>

          </table>
        </div>
      )
    } else {
      return (
      <div className=' d-flex justify-content-center  height-calc-70 align-items-center' >
        <i className='fa fa-spinner fa-spin  fa-5x'></i>
      </div>)

    }
  };

  return (
    <>
    
    <div className=" my-3 text-center ">
        <NavLink to='/orders/add' className='btn btn-primary' >إضافة أوردر</NavLink>
      </div>
    {showOrders()}
    </>
  )
}
