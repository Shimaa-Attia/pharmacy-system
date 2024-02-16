import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/AuthStore';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';
import { toast } from 'react-toastify';

export default function CustomersService() {
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
      let sendEditedStatusDataToApi = async (purchId) => {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/shortcomings/updateStatus/${purchId}`, status, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        }).then((res) => {
          toast.success(res.data.message)
          getCustomersServiceProducts()
          setStatus({
            status_id: ''
          });
          setPurchId('');
       
        }).catch((errors) => {
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
      let [purchId, setPurchId] = useState('')
      useEffect(() => {
        if (status.status_id !== '') {
          sendEditedStatusDataToApi(purchId);
    
        }
      }, [status.status_id]);

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
                <th> تغيير الحالة</th>
                <th>متوفر بالفرع الآخر</th>
              </tr>
            </thead>
            <tbody>
              {customersServiceProducts.map((service, index) => <tr key={index}>
                <td data-label="اسم الصنف">{service?.productName}</td>
                <td data-label="العميل">{service?.clientInfo}</td>
                <td data-label="الحالة">{service?.status?.name}</td>
                <td data-label="تغيير الحالة"  >
                  <div >
                    <select name="status_id" className='form-control m-auto' id="status_id" defaultValue={0}
                      onChange={(event) => {
                        setStatus({
                          ...status,
                          status_id: event?.target?.value
                        });
                        setPurchId(service.id)
                      }}
                    >
                      <option value={0} hidden disabled>اختر</option>
                      {statusData.map((stat) => <option key={stat.id} value={stat.id}>{stat?.name}</option>)}
                    </select>

                  </div>
                </td>
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
    <div className="row">
    <div className='col-md-4'>
        <NavLink to='/addstatus' className='btn btn-primary my-2  mx-3'>إضافة حالة</NavLink>
      </div>
      <div className='col-md-8'>
          <NavLink to='/shortcomings/add' className='btn btn-danger m-2  '>إضافة النواقص</NavLink>
        </div>
    </div>

      <div className="text-center mb-2">
        <Pagination pagination={pagination} currentPage={currentPage} handlePageChange={handlePageChange}/>
      </div>
 {showCustomersServiceProducts()}
    </>
  )
}
