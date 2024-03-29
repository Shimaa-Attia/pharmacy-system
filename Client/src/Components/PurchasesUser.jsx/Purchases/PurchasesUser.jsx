
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../Context/AuthStore';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pagination from '../../Pagination/Pagination';

export default function PurchasesUser() {
  let { accessToken } = useContext(AuthContext);
  let [pagination, setPagination] = useState(null);
  let [currentPage, setCurrentPage] = useState(1); // Current page state
  let [filterBranchId, setFilterBranchId] = useState('');
  
  let [searchText, setSearchText] = useState('');
  function handleSearchChange(event) {
    setSearchText(event?.target?.value)
  };
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
  let [filterClientInfo, setFilterClientInfo] = useState('');
  function handleClientInfoClick() {
    setFilterClientInfo('notNull')
  }
  let [purchasesData, setPurchasesData] = useState([]);
  let getPurchasesData = async (page =1) => {
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
      urlApi += `fromDate=${filterDate}&`
    }
    if (filterClientInfo !== undefined && filterClientInfo.length > 0) {
      urlApi += `clientInfo=${filterClientInfo}&`
    }
    if (searchText !== undefined && searchText.trim().length > 0) {
      urlApi += `key=${searchText}&`
    }
    urlApi += `page=${page}`
    purchResult = await axios.get(urlApi, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
    setPurchasesData(purchResult.data.data)
    setPagination(purchResult.data.meta); // Set pagination data
    setCurrentPage(page); // Set current page

  }
  useEffect(() => {
    getPurchasesData()
  }, [filterClientInfo,filterProductType, filterBranchId, filterStatusId, filterIsAvailableInOtherBranch, filterDate , searchText]);
    //for handle page change
    let handlePageChange = (page) => {
      getPurchasesData(page);
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
      // getPurchasesData()
   
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
    //for making come from
    let [comeFrom, setComeFrom] = useState({
      avillable_fromWhere: ''
    })
  
    let getInputValue = (event) => {
      let { name, value } = event.target;
      setComeFrom(prevState => ({ ...prevState, [name]: value }));
    };
    let sendComeFromToApi = async (purchId) => {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/shortcomings/${purchId}`, comeFrom, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      }).then((res) => {
        toast.success(res.data.message, {
          position: 'top-center'
        });
        // getPurchasesData()
      }).catch((errors) => {
        try {
          const errorList = errors?.response?.data?.error;
          if (errorList !== undefined) {
            Object.keys(errorList)?.map((err) => {
              errorList[err]?.map((err) => {
                toast.error(err);
              })
            });
          } else {
            toast.error("حدث خطأ ما");
          }
        } catch (error) {
          toast.error("حدث خطأ ما");
        }
  
      });
    };
    let submitComeFrom = (e, purchId) => {
      e.preventDefault();
      sendComeFromToApi(purchId)
    }

  let showPurchases = () => {
    if (purchasesData.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive">
          <table dir="rtl" className='table  table-hover text-center align-middle   table-responsive-list '>
            <thead className='table-primary no-wrap-heading'>
              <tr>
                <th>اسم الصنف</th>
                <th>العميل</th>
                <th>الحالة</th>
                <th> تغيير الحالة</th>
                <th> متوفر منين </th>
                <th > ملاحظات</th>
                <th>الفرع</th>
                <th>الموظف</th>
                <th>متوفر بالفرع الأخر</th>
                <th>نوع المنتج</th>
                <th> تاريخ الإنشاء</th>
                <th>خيارات</th>
              </tr>
            </thead>
            <tbody>
              {purchasesData.map((purch, index) => <tr key={index}>
                <td data-label="اسم الصنف">{purch?.productName}</td>
                <td data-label="العميل"  >{purch?.clientInfo}</td>
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
                      {statusData.map((stat) => <option key={stat.id} value={stat.id}>{stat?.name}</option>)}
                    </select>

                  </div>
                </td>
                <td data-label="متوفر منين" style={{ minWidth: '200px' }} >
                  <div>
                    <form onSubmit={(e) => submitComeFrom(e, purch.id)} >
                      <div className=" d-flex align-items-center">
                        <input type="text" name='avillable_fromWhere' className='form-control mx-1' onChange={getInputValue} />
                        <button type='submit' className='btn btn-sm btn-primary'>تم</button>
                      </div>

                    </form>
                    <p>
                      {purch?.avillable_fromWhere}
                    </p>
                  </div>
                </td>
                <td data-label="ملاحظات">{purch?.notes}</td>
                <td data-label="الفرع">{purch?.branch?.name}</td>
                <td data-label="الموظف">{purch?.creatorUser?.name}</td>
                <td data-label="متوفر بالفرع الأخر">{purch?.isAvailable_inOtherBranch == 1 ? "متوفر" : "غير متوفر"}</td>
                <td data-label="نوع المنتج"  >{purch?.productType}</td>
                <td data-label="تاريخ الإنشاء"  >{purch?.created_at}</td>
                <td data-label="خيارات" style={{ minWidth: '150px' }} >
                  <NavLink to={`/purchasesuser/delete/${purch.id}`} >
                    <i className='bi bi-trash text-bg-danger p-1 mx-1 rounded'></i>
                  </NavLink>
                  <NavLink to={`/purchasesuser/edite/${purch.id}`} >
                    <i className='bi bi-pencil-square text-bg-primary mx-1  p-1 rounded'></i>
                  </NavLink>
                  <NavLink to={`/purchasesuser/details/${purch.id}`} >
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
          {purchasesData.length <= 0 && filterBranchId.length <= 0 && filterProductType.length <= 0 && filterBranchId.length <= 0 && filterDate.length <= 0 && filterIsAvailableInOtherBranch.length <= 0 && filterStatusId.length <= 0 && searchText.length <= 0 ?
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
        <div className='col-md-4'>
          <NavLink to='/shortcomingspurchases/add' className='btn btn-danger mb-2 '>إضافة النواقص</NavLink>
        </div>
        <div className="col-md-4 mb-1">       
          <button  className='btn btn-secondary' onClick={handleClientInfoClick} >فلتر العميل</button>
        </div>
        <div className="col-md-4" >
          <input type="text" className='form-control text-end mb-1' placeholder='بحث  ...' onChange={handleSearchChange} />
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
      <div className="text-center mb-2">
        <Pagination pagination={pagination} currentPage={currentPage} handlePageChange={handlePageChange}/>
      </div>
      {showPurchases()}
    </>
  )
}
