import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/AuthStore';
import { NavLink } from 'react-router-dom';

export default function Purchases() {
  let { accessToken } = useContext(AuthContext);
  let [purchasesData, setPurchasesData] = useState([]);
  let getPurchasesData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/shortcomings`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    console.log(data.data);
    setPurchasesData(data.data)
  }
  useEffect(() => {
    getPurchasesData()
  }, []);

  let showPurchases = () => {
    if (purchasesData.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive mt-4">
          <table dir="rtl" responsive='sm' className='table  table-hover text-center align-middle table-responsive-list '>
            <thead className='table-primary'>
              <tr>
                <th> تاريخ الإنشاء</th>
                <th>اسم الصنف</th>
                <th>متوفر بالفرع الأخر</th>
                <th>نوع المنتج</th>
                <th>الفرع</th>
                <th> الأكشن</th>
                <th>خيارات</th>
              </tr>
            </thead>
            <tbody>
              {purchasesData.map((purch, index) => <tr key={index}>
                <td data-label="تاريخ الإنشاء"  >{purch.created_at}</td>
                <td data-label="اسم الصنف">{purch?.productName}</td>
                <td data-label="متوفر بالفرع الأخر">{purch?.isAvailable_inOtherBranch == 1 ? "متوفر" : "غير متوفر"}</td>
                <td data-label=" نوع المنتج">{purch?.productType}</td>
                <td data-label="الفرع">{purch?.branch.name}</td>
                <td data-label=" الأكشن">
                  <div>
                    <form>
                      <select name="branch_id" defaultValue={0} className='form-control' id="branch_id">
                        <option value={0} hidden disabled>اختار</option>
                        <option>فرع</option>
                      </select>
                    </form>
                  </div>
                </td>
                <td data-label="خيارات">
                  <NavLink to={`/purchases/delete/${purch.id}`} >
                    <i className='bi bi-trash text-bg-danger p-1 mx-1 rounded'></i>
                  </NavLink>
                  <NavLink to={`/purchases/edite/${purch.id}`} >
                    <i className='bi bi-pencil-square text-bg-primary mx-1  p-1 rounded'></i>
                  </NavLink>
                  <NavLink to={`/purchases/details/${purch.id}`} >
                    <i className='bi bi-list-ul text-bg-success mx-1  p-1 rounded'></i>
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
          <i className='fa fa-spinner fa-spin  fa-5x'></i>

        </div>)
    }
  };
  return (
    <>

      <div className='text-center m-3 fs-4 fw-bold  bg-secondary text-white rounded p-1 ' >المشتريات</div>
      {showPurchases()}
    </>
  )
}
