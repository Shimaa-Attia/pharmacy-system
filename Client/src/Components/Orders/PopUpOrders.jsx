
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { AuthContext } from '../../Context/AuthStore';
import Pagination from '../Pagination/Pagination';


export default function PopUpOrders() {
  let { accessToken } = useContext(AuthContext);
  let [pagination, setPagination] = useState(null);
  let [currentPage, setCurrentPage] = useState(1); // Current page state
  let [orders, setOrders] = useState([]);
  let getOrderData = async (page = 1) => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/unAcceptedOrders?page=${page}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setOrders(data.data);
    setPagination(data.meta); // Set pagination data
    setCurrentPage(page); // Set current page

  }
  useEffect(() => { getOrderData() }, []);
  //for handle page change
  let handlePageChange = (page) => {
    getOrderData(page);
  };


  let showOrders = () => {
    if (orders.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive">
          <table dir="rtl" className='table  table-hover text-center align-middle table-responsive-list '>
            <thead className='table-primary  no-wrap-heading'>
              <tr>
                <th> تاريخ الإنشاء</th>
                <th>كود العميل</th>
                <th> نقطة اليبع</th>
                <th>المنطقة </th>
               
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => <tr key={order.id}>
                <td data-label="تاريخ الإنشاء"  >{order.created_at}</td>
                <td data-label="كود العميل">{order?.customer?.code}</td>
                <td data-label="نقطة البيع">{order?.sale_point?.name}</td>
                <td data-label=" المنطقة">{order?.area?.name}</td>
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
        </div>
      )
    }
  };



  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Orders</title>
      </Helmet>
      <div>
        <p className='alert alert-danger m-3 text-center fw-bold fs-4' >الأوردرات المعلقة</p>
      </div>
      <div className="text-center my-2">
        <Pagination pagination={pagination} currentPage={currentPage} handlePageChange={handlePageChange} />
      </div>
      {showOrders()}
    </>
  )
}
