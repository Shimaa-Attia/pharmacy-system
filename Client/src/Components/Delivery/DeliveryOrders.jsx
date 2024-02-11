import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';
import { toast } from 'react-toastify';
import Pagination from '../Pagination/Pagination';

export default function DeliveryOrders() {
  let { accessToken } = useContext(AuthContext);
  let [pagination, setPagination] = useState(null);
  let [currentPage, setCurrentPage] = useState(1); // Current page state
  let { id } = useParams();
  let [orders, setOrders] = useState([]);
  let [searchText, setSearchText] = useState('');
  function handleSearchChange(event) {
    setSearchText(event.target.value)
  };
  let getOrderData = async (page=1) => {
    let searchResult;
    if (searchText !== undefined && searchText.trim().length > 0) {
      try {
        searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/user/${id}?key=${searchText.trim()}`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        setOrders(searchResult.data.data);
      } catch (error) {
        toast.error('حدث خطأ ما')
      } 
    } else {
      try {
        searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/user/${id}?page=${page}`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });
        setOrders(searchResult.data.data);
        setPagination(searchResult.data.meta); // Set pagination data
        setCurrentPage(page); // Set current page
      } catch (error) {
        toast.error('حدث خطأ ما')
      }
    }  
  };

  useEffect(() => {
    getOrderData();
  }, [searchText]);
//for handle page change
  let handlePageChange = (page) => {
    getOrderData(page);
  };

    //get total money with the delivery from all orders
   let [unpaidAmount , setUnpaidAmmount] = useState([]);
    let getUnpiadAmmountForDelivery = async () => {
      try {
        let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/show/${id}` , {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });
        setUnpaidAmmount(data.data)
      } catch (error) {
        toast.error('حدث خطأ ما')
      }
    };
  useEffect(()=>{
    getUnpiadAmmountForDelivery()
  },[]);
  //for delivary paid for himself
  let sendDelavaryPaidsToApi = async (ordId) => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/orders/deliveryOrderPay/${ordId}`,{}, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {  
      toast.success(res.data.message);
      getOrderData()
    }).catch((errors) => {
      toast.error('حدث خطأ ما');
      toast.error(errors?.response?.data?.message);
    })
  }
  let showOrders = () => {
    if (orders.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive ">
          <table dir="rtl"  className='table  table-hover text-center align-middle table-responsive-list '>
            <thead className='table-primary  no-wrap-heading'>
              <tr>
                <th>رقم</th>
                <th>تاريخ الإنشاء</th>
                <th>كود العميل</th>
                <th>اسم العميل</th>
                <th>إجمالي المبلغ</th>
                <th>نقطة البيع</th>
                <th>المطلوب سداده</th>
                <th>تاريخ السداد</th>
                <th>سداد</th>
                <th>خيارات</th>  
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => <tr key={order.id}>
                <td data-label="#">{++index}</td>
                <td data-lable="تاريخ الإنشاء" >{order?.created_at}</td>
                <td data-label="كود العميل">{order?.customer?.code}</td>
                <td data-label="اسم العميل">{order?.customer?.name}</td>
                <td data-label=" إجمالي المبلغ">{order?.total_ammount}</td>
                <td data-label="نقطة البيع">{order?.sale_point?.name}</td>
                <td data-label="المطلوب سداده">{order?.unpaid}</td>
                <td data-label="تاريخ السداد">{order?.payed_at}</td>
                <td data-label="سداد" >
                {order.unpaid ? <i className='bi bi-x-circle-fill text-danger fs-4' 
                  onClick={ () => sendDelavaryPaidsToApi(order.id)} ></i>
                   : <i className='bi bi-check-circle-fill text-success fs-4 ' ></i>}
                </td>
                <td data-label=" خيارات">
                <NavLink to={`/deliveryOrders/delete/${order.id}`} >
                    <i className='bi bi-trash text-bg-danger p-1 mx-1 rounded'></i>
                  </NavLink>
                </td>
              </tr>
              )}
            </tbody>
          </table>
        </div>
      )
    } else {
      return (
        <div className=' d-flex justify-content-center  height-calc-70 align-items-center' >
         {orders.length <= 0 && searchText.length <= 0  ?
            <i className='fa fa-spinner fa-spin  fa-5x'></i>
            : <div className='alert alert-danger w-50 text-center'>لا يوجد أوردرات</div>
          }
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
            <NavLink to={`/deliveryOrders/add/${id}`} className='btn btn-primary mb-1' >إضافة أوردر</NavLink>
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
      <div className="text-center mb-3">
      <Pagination pagination={pagination} currentPage={currentPage} handlePageChange={handlePageChange}/>

      </div>
      {showOrders()}
    </>
  )
}
