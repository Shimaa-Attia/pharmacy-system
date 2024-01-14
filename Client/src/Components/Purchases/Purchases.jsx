import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/AuthStore';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Purchases() {
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
  //get status data
  let [statusData, setStatusData] = useState([]);

  let getStatusData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/getCustomList/status`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setStatusData(data)
  }
  useEffect(() => {
    getStatusData()
  }, []);
  let [status, setStatus] = useState({
    status_id: ''
  })
  let sendEditedStatusDataToApi = async (statId) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/shortcomings/updateStatus/${statId}`, status, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      console.log(res);
      setStatus({
        status_id: ''
      })
      toast.success(res.data.message)
      console.log(status);

    }).catch((errors) => {
      console.log(errors);
      if (errors.response.data.message == "غير موجود") {
        toast.error(errors.response.data.message)
      } else {
        const errorList = errors?.response?.data?.message;
        if (errorList !== undefined) {
          Object.keys(errorList)?.map((err) => {
            errorList[err]?.map((err) => {
              toast.error(err);
            })
          });
        } else {
          toast.error("حدث خطأ ما");
        }
      }
    })
  };

  let showPurchases = () => {
    if (purchasesData.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive ">
          <table dir="rtl" responsive='sm' className='table  table-hover text-center align-middle table-responsive-list '>
            <thead className='table-primary'>
              <tr>
                <th> تاريخ الإنشاء</th>
                <th>اسم الصنف</th>
                <th>متوفر بالفرع الأخر</th>

                <th>الفرع</th>
                <th>الحالة</th>
                <th> تغيير الحالة</th>

                <th>خيارات</th>
              </tr>
            </thead>
            <tbody>
              {purchasesData.map((purch, index) => <tr key={index}>
                <td data-label="تاريخ الإنشاء"  >{purch.created_at}</td>
                <td data-label="اسم الصنف">{purch?.productName}</td>
                <td data-label="متوفر بالفرع الأخر">{purch?.isAvailable_inOtherBranch == 1 ? "متوفر" : "غير متوفر"}</td>
                <td data-label="الفرع">{purch?.branch.name}</td>
                <td data-label="الحالة">{purch?.status?.name}</td>
                <td data-label="تغيير الحالة">
                  <div >
                    <select name="name" className='form-control w-50 m-auto' id="name" defaultValue={0}
                      onChange={(e) => {
                        // let statusId = e.target.value;
                        // console.log(statusId);
                        setStatus({
                          status_id: e.target.value
                        })
                        // console.log(e.target.value);                 
                        //        console.log(status);
                        // if (status) {
                        //   sendEditedStatusDataToApi(purch.id)
                     
                        // }

                      }}
                    >
                      <option value={0} hidden disabled>اختار</option>
                      {statusData.map((stat) => <option key={stat.id} value={stat.id}>{stat.name}</option>)}
                    </select>

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
      <div>
        <NavLink to='/shortcomings/add' className='btn btn-danger mb-3 mx-3'>إضافة النواقص</NavLink>
      </div>
      {showPurchases()}
    </>
  )
}
