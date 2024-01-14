import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/AuthStore';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

export default function CustomersService() {
  let { accessToken } = useContext(AuthContext);
  let [purchasesData, setPurchasesData] = useState([]);
  let getPurchasesData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/shortcomings`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setPurchasesData(data.data)
  }
  useEffect(() => {
    getPurchasesData()
  }, []);

  let showPurchases = () => {
    if (purchasesData.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive  ">
          <table dir="rtl" responsive='sm' className='table  table-hover text-center align-middle table-responsive-list '>
            <thead className='table-primary'>
              <tr>
                <th>اسم الصنف</th>
                <th>متوفر بالفرع الأخر</th>
                <th>نوع المنتج</th>

              </tr>
            </thead>
            <tbody>
              {purchasesData.map((purch, index) => <tr key={index}>
                <td data-label="اسم الصنف">{purch?.productName}</td>
                <td data-label="متوفر بالفرع الأخر">{purch?.isAvailable_inOtherBranch == 1 ? "متوفر" : "غير متوفر"}</td>
                <td data-label=" نوع المنتج">{purch?.productType}</td>



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
      <div>
        <NavLink to='/addstatus' className='btn btn-primary my-3  mx-3'>إضافة حالة</NavLink>
      </div>
      {showPurchases()}
    </>
  )
}
