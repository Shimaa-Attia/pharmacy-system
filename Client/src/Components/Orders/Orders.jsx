import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';

export default function Orders() {
  let { accessToken } = useContext(AuthContext);

  let [orders, setOrders] = useState([]);

  let [searchText, setSearchText] = useState('');
  function handleSearchChange(event) {
    setSearchText(event.target.value)

  };

  let getOrderData = async () => {
    let searchResult;
    if (searchText !== undefined && searchText.trim().length > 0) {
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/search/${searchText.trim()}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setOrders(searchResult.data.data);
    } else {
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });  
      setOrders(searchResult.data.data);

    }
  };
  useEffect(() => { getOrderData() }, [searchText]);

  let showOrders = () => {
    if (orders.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 ">
          <table responsive='sm' className='table table-bordered table-hover text-center table-responsive-list '>
            <thead className='table-primary'>
              <tr>
                <th>خيارات</th>
                <th>قيمة الأوردر</th>
                <th>هاتف العميل</th>
                <th>اسم العميل</th>
                <th>هاتف الطيار</th>
                <th>اسم الطيار</th>
                {/* <th>كود الطيار</th> */}
                <th>رقم</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => <tr key={order.id}>
                <td data-label="خيارات">
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
                <td data-label="قيمة الأوردر">{order.cost}</td>
                <td data-label="هاتف العميل">{order?.customer_phone}</td>
                <td data-label="اسم العميل">{order?.customer?.name}</td>
                <td data-label="هاتف الطيار">{order?.delivery_man?.phone}</td>
                <td data-label="اسم الطيار">{order?.delivery_man?.name}</td>
              
                <td data-label="#">{++index}</td>
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
      <Helmet>
        <meta charSet="utf-8" />
        <title>Orders</title>
      </Helmet>
      <div className=" my-3 text-center row mx-2  ">
        <div className="col-md-6">
          <NavLink to='/orders/add' className='btn btn-primary mb-1' >إضافة أوردر</NavLink>
        </div>
        <div className="col-md-4">
          <input type="text" className='form-control text-end mt-1 ' placeholder=' ...بحث عن أوردر ' onChange={handleSearchChange} />
        </div>
      </div>
      {showOrders()}
    </>
  )
}
