import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';



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
      setOrders(searchResult.data.data);
    } else {
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/user/${id}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setOrders(searchResult.data.data);
    }
    
  };
  useEffect(() => { getOrderData() }, [searchText]);

    //get total money with the delivery from all orders
   let [unpaidAmount , setUnpaidAmmount] = useState([]);
    let getUnpiadAmmountForDelivery = async () => {
      let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/show/${id}` , {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setUnpaidAmmount(data.data)
    };
  useEffect(()=>{
    getUnpiadAmmountForDelivery()
  },[]);
  let showOrders = () => {
    if (orders.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 ">
          <table dir="rtl" responsive='sm' className='table table-bordered table-hover text-center table-responsive-list'>
            <thead className='table-primary'>
              <tr>
                <th>رقم</th>
                <th>تاريخ الإنشاء</th>
                <th>كود العميل</th>
                <th>اسم العميل</th>
                <th>قيمة الأوردر</th>
                <th>إجمالي المبلغ</th>
                <th>نقطة البيع</th>
                <th>المطلوب سداده</th>
                
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => <tr key={order.id}>
          
                <td data-label="#">{++index}</td>
                <td data-lable="تاريخ الإنشاء" >{order?.created_at}</td>
                <td data-label="كود العميل">{order?.customer?.code}</td>
                <td data-label="اسم العميل">{order?.customer?.name}</td>
                <td data-label="قيمة الأوردر">{order?.cost}</td>
                <td data-label=" إجمالي المبلغ">{order?.total_ammount}</td>
                <td data-label="نقطة البيع">{order?.sale_point?.name}</td>
                <td data-label="المطلوب سداده">{order?.unpaid}</td>
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
        <title>Delivery Orders</title>
      </Helmet>
      
      <div className='container'>
        <div className=" my-3 text-center row   ">
          <div className="col-md-4 ">
            <NavLink to={`/deliverylayout/add/${id}`} className='btn btn-primary mb-1' >إضافة أوردر</NavLink>
          </div>
          <div className="col-md-4">
            <input type="text" className='form-control text-end mt-1 ' placeholder=' ...بحث عن أوردر ' onChange={handleSearchChange} />
          </div>
          <div className="col-3 m-auto bg-secondary-subtle mt-1 rounded">
            <p className=' text-bg-danger rounded p-1 fw-bolder ' >إجمالي المبلغ المطلوب سداده</p>
            <p className='fw-bolder '>{unpaidAmount?.unpaidAmount}</p>
          </div>
        </div>
      </div>

      {showOrders()}
    </>
  )
}
