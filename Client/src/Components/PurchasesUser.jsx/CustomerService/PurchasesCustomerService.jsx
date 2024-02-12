
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../Context/AuthStore';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import Pagination from '../../Pagination/Pagination';

export default function PurchasesCustomerService() {
  let { accessToken } = useContext(AuthContext);
  let [pagination, setPagination] = useState(null);
  let [currentPage, setCurrentPage] = useState(1); // Current page state
  let [customersServiceProducts , setCustomersServiceProducts  ] = useState([]);
  let getCustomersServiceProducts   = async (page = 1) => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/shortcomings/customersServiceProducts?page=${page}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setCustomersServiceProducts(data.data)
    setPagination(data.meta); // Set pagination data
    setCurrentPage(page); // Set current page
  }
  useEffect(() => {
    getCustomersServiceProducts()
  }, []);
      //for handle page change
      let handlePageChange = (page) => {
        getCustomersServiceProducts(page);
      };

  let showCustomersServiceProducts = () => {
    if (customersServiceProducts.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive  ">
          <table dir="rtl" responsive='sm' className='table  table-hover text-center align-middle table-responsive-list '>
            <thead className='table-primary  no-wrap-heading'>
              <tr>
                <th>اسم الصنف</th>
                <th>العميل</th>
                <th> الحالة</th>
                <th> نوع المنتج</th>
                <th>متوفر بالفرع الآخر</th>
              </tr>
            </thead>
            <tbody>
              {customersServiceProducts.map((service, index) => <tr key={index}>
                <td data-label="اسم الصنف">{service?.productName}</td>
                <td data-label="العميل">{service?.clientInfo}</td>
                <td data-label="الحالة">{service?.status?.name}</td>
                <td data-label="نوع المنتج">{service?.productType}</td>
                <td data-label="متوفر بالفرع الأخر">{service?.isAvailable_inOtherBranch == 1 ? "متوفر" : "غير متوفر"}</td>

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
      <div className="text-center my-3">
        <Pagination pagination={pagination} currentPage={currentPage} handlePageChange={handlePageChange}/>
      </div>
 {showCustomersServiceProducts()}
    </>
  )
}
