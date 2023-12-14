import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Orders() {
  let accessToken = localStorage.getItem('userToken');
  let [orders, setOrders] = useState([]);
  let [users, setUsers] = useState([]);

  let getUserData = async () => {
    let { data } = await axios.get(`http://127.0.0.1:8000/api/users`);
    data.data.map((user) => {
      return setUsers(user);

    });
  };
  useEffect(() => {
    getUserData()
  }, []);
  let [searchText, setSearchText] = useState('');
  function handleSearchChange(event) {
    setSearchText(event.target.value)

  };

  let getOrderData = async () => {
    let searchResult;
    if (searchText !== undefined && searchText.trim().length > 0) {
      searchResult = await axios.get(`http://127.0.0.1:8000/api/orders/search/${searchText.trim()}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      console.log('Hi from Search ')
      setOrders(searchResult.data);

    } else {
      searchResult = await axios.get(`http://127.0.0.1:8000/api/orders`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      console.log('Hi from No Search ')
      setOrders(searchResult.data.data);

    }


  };
  useEffect(() => { getOrderData() }, [searchText]);

  let showOrders = () => {
    if (orders.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 ">
          <Table responsive='sm' className='table table-bordered table-hover text-center '>
            <thead  className='table-primary'>
              <tr>
                <th>خيارات</th>
                <th>هاتف العميل</th>

                <th>هاتف الطيار</th>
                <th>اسم الطيار</th>
                <th>كود الطيار</th>
                <th>رقم</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => <tr key={order.id}>
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
                <td>{order.customer_phone}</td>
                <td>{users.phone}</td>
                <td>{users.name}</td>
                <td>{users.code}</td>
                <td>{++index}</td>
              </tr>
              )}
            </tbody>

          </Table>
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

      <div className=" my-3 text-center row mx-2  ">
        <div className="col-md-6">
          <NavLink to='/orders/add' className='btn btn-primary' >إضافة أوردر</NavLink>
        </div>
        <div className="col-md-4">
          <input type="text" className='form-control text-end ' placeholder=' ...بحث عن أوردر ' onChange={handleSearchChange} />
        </div>
      </div>
      {showOrders()}
    </>
  )
}
