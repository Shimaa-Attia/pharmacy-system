
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/AuthStore';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function DoctorPurchases() {
  let { accessToken } = useContext(AuthContext);
  let [filterBranchId, setFilterBranchId] = useState('');
  function handleBranchChange(event) {
    setFilterBranchId(event?.target?.value)
  }
  let [filterProductType, setFilterProductType] = useState('');
  function handleProductTypeChange(event) {
    setFilterProductType(event?.target?.value);
  }
  let [filterStatusId, setFilterStatusId] = useState('');
  function handleStatusIdChange(event) {
    setFilterStatusId(event.target.value)
  }
  let [filterIsAvailableInOtherBranch, setFilterIsAvailableInOtherBranch] = useState('');
  function handleIsAvailableInOtherBranchChange(event) {
    setFilterIsAvailableInOtherBranch(event.target.value)
  }
  let [filterDate, setFilterDate] = useState('');
  function handleDateChange(event) {
    setFilterDate(event.target.value)
  }

  let [purchasesData, setPurchasesData] = useState([]);
  let getPurchasesData = async () => {
    let urlApi = `${process.env.REACT_APP_API_URL}/api/shortcomings/filter?`;
    let purchResult;
    if (filterProductType !== undefined && filterProductType.trim().length > 0) {
      urlApi += `productType=${filterProductType}&`
    }
    if (filterBranchId !== undefined && filterBranchId.length > 0) {
      urlApi += `branch_id=${filterBranchId}&`
    }
    if (filterStatusId !== undefined && filterStatusId.length > 0) {
      urlApi += `status_id=${filterStatusId}&`
    }
    if (filterIsAvailableInOtherBranch !== undefined && filterIsAvailableInOtherBranch.trim().length > 0) {
      urlApi += `isAvailable_inOtherBranch=${filterIsAvailableInOtherBranch}&`

    }
    if (filterDate !== undefined && filterDate.length > 0) {
      urlApi += `fromDate=${filterDate}`

    }
    purchResult = await axios.get(urlApi, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
    setPurchasesData(purchResult.data.data)

  }
  useEffect(() => {
    getPurchasesData()
  }, [filterProductType, filterBranchId, filterStatusId, filterIsAvailableInOtherBranch, filterDate]);
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
      getPurchasesData()


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
      setStatus({
        status_id: ''
      });
    }
  }, [status.status_id]);

  let showPurchases = () => {
    if (purchasesData.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive ">
          <table dir="rtl" responsive='sm' className='table  table-hover text-center align-middle table-responsive-list '>
            <thead className='table-primary'>
              <tr>
                <th> تاريخ الإنشاء</th>
                <th>متوفر بالفرع الأخر</th>
                <th>اسم الصنف</th>
                <th>العميل</th>
                <th>نوع المنتج</th>
                <th>الحالة</th>
                <th> تغيير الحالة</th>
                <th>خيارات</th>
              </tr>
            </thead>
            <tbody>
              {purchasesData.map((purch, index) => <tr key={index}>
                <td data-label="تاريخ الإنشاء"  >{purch.created_at}</td>
                <td data-label="متوفر بالفرع الأخر">{purch?.isAvailable_inOtherBranch == 1 ? "متوفر" : "غير متوفر"}</td>
                <td data-label="اسم الصنف">{purch?.productName}</td>
                <td data-label="العميل"  >{purch.clientInfo}</td>
                <td data-label="نوع المنتج"  >{purch.productType}</td>
                <td data-label="الحالة" >{purch?.status?.name}</td>
                <td data-label="تغيير الحالة"  >
                  <div >
                    <select name="status_id" className='form-control m-auto' id="status_id" defaultValue={0}
                      onChange={(event) => {
                        setStatus({
                          ...status,
                          status_id: event?.target?.value
                        });
                        setPurchId(purch.id)
                      }}
                    >
                      <option value={0} hidden disabled>اختر</option>
                      {statusData.map((stat) => <option key={stat.id} value={stat.id}>{stat.name}</option>)}
                    </select>

                  </div>
                </td>
                <td data-label="خيارات" style={{ minWidth: '150px' }} >
                  <NavLink to={`/doctorlayout/doctorpurchases/details/${purch.id}`} >
                    <i className='bi bi-list-ul text-bg-success mx-1  p-1 rounded'></i>
                  </NavLink>
                  <NavLink to={`/doctorlayout/doctorpurchases/edite/${purch.id}`} >
                    <i className='bi bi-pencil-square text-bg-primary mx-1  p-1 rounded'></i>
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
          {purchasesData.length <= 0 && filterBranchId.length <= 0 && filterProductType.length <= 0 && filterBranchId.length <= 0 && filterDate.length <= 0 && filterIsAvailableInOtherBranch.length <= 0 &&filterStatusId.length <=0 ?
            <i className='fa fa-spinner fa-spin  fa-5x'></i>
            : <div className='alert alert-danger w-50 text-center'>لا يوجد مشتريات</div>
          }
        </div>)
    }
  };
  let [branches, setBranches] = useState([]);
  let getBranches = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/getCustomList/branch`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setBranches(data)
  }
  useEffect(() => {
    getBranches()
  }, []);
  return (
    <>

      <div className='text-center m-3 fs-4 fw-bold  bg-secondary text-white rounded p-1 ' >المشتريات</div>
      <div className='row mx-2' dir='rtl'>
        <div className='col-md-12'>
          <NavLink to='/doctorlayout/add' className='btn btn-danger mb-3 mx-3'>إضافة النواقص</NavLink>
        </div>
        <div className="col-md-2 mb-1">
          <select name="productType" defaultValue={0} className='form-control'
            onChange={handleProductTypeChange}>
            <option value={0} hidden disabled>اختر نوع المنتج...</option>
            <option value="أدوية">أدوية</option>
            <option value="تركيبات">تركيبات</option>
            <option value="كوزمو">كوزمو</option>
            <option value="مستلزمات طبية">مستلزمات طبية </option>
          </select>
        </div>
        <div className="col-md-2 mb-1">
          <select name="branch_id" defaultValue={0} className='form-control' id="branch_id"
            onChange={handleBranchChange}>
            <option value={0} hidden disabled>اختر الفرع...</option>
            {branches.map((branch) => <option key={branch.id} value={branch?.id}>{branch?.name}</option>)}
          </select>
        </div>
        <div className="col-md-2 mb-1">
          <select name="status_id" defaultValue={0} className='form-control'
            onChange={handleStatusIdChange}>
            <option value={0} hidden disabled>اختر حالة...</option>
            <option value="none">بدون حالة</option>
            {statusData.map((stat) => <option key={stat.id} value={stat.id}>{stat.name}</option>)}
          </select>
        </div>
        <div className="col-md-2 mb-1">
          <input type="date" className='form-control' onChange={handleDateChange} />
        </div>
        <div className="col-md-3 mb-1">
          <select name="branch_id" defaultValue={0} className='form-control' id="branch_id"
            onChange={handleIsAvailableInOtherBranchChange}>
            <option value={0} hidden disabled>اختر متوفر بالفرع الآخر...</option>
            <option value="yes">متوفر</option>
            <option value="no">غير متوفر</option>
          </select>
        </div>

      </div>
      {showPurchases()}
    </>
  )
}
