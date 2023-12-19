import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';
import { Table } from 'react-bootstrap';


export default function DeliveryOrders() {
  let { accessToken } = useContext(AuthContext);
  let { id } = useParams();

  let [orders, setOrders] = useState([]);
  let [searchText, setSearchText] = useState('');
  function handleSearchChange(event) {
    setSearchText(event.target.value)

  };
  let getOrderData = async () => {
    let searchResult;
    if (searchText !== undefined && searchText.trim().length > 0) {
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/user/${id}?key=${searchText.trim()}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      console.log('search');
      console.log(searchResult);
      setOrders(searchResult.data.data);
    } else {
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/user/${id}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      console.log('no search');
      console.log(searchResult);

      setOrders(searchResult.data.data);

    }
  };
  useEffect(() => { getOrderData() }, [searchText]);
  let showOrders = () => {
    if (orders.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 ">
          <Table responsive='sm' className='table table-bordered table-hover text-center '>
            <thead className='table-primary'>
              <tr>
                <th>خيارات</th>
                <th>قيمة الأوردر</th>
                <th>هاتف العميل</th>
                <th>اسم العميل</th>
                <th>كود العميل</th>
                <th>رقم</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => <tr key={order.id}>
                <td>
                
                  <NavLink to={`/deliverylayout/edite/${order.id}`} >
                    <i className='bi bi-pencil-square text-bg-primary  p-1 rounded'></i>
                  </NavLink>
               
                </td>
                <td>{order.cost}</td>
                <td>{order?.customer_phone}</td>
                <td>{order?.customer?.name}</td>
                <td>{order?.customer?.code}</td>

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
      <Helmet>
        <meta charSet="utf-8" />
        <title>Delivery Orders</title>
      </Helmet>
      <div className='container'>
        <div className=" my-3 text-center row   ">
          <div className="col-md-6 ">
            <NavLink to={`/deliverylayout/add/${id}`} className='btn btn-primary' >إضافة أوردر</NavLink>
          </div>
          <div className="col-md-4">
            <input type="text" className='form-control text-end ' placeholder=' ...بحث عن أوردر ' onChange={handleSearchChange} />
          </div>
        </div>
      </div>

      {showOrders()}
    </>
  )
}
