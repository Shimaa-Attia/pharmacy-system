import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';
import styles from '../Doctor/DoctorOrders.module.css'
import { toast } from 'react-toastify';
import Joi from 'joi';
import Select from 'react-select';
import Pagination from '../Pagination/Pagination';



export default function DoctorOrders() {

  let { accessToken } = useContext(AuthContext);
  let [pagination, setPagination] = useState(null);
  let [currentPage, setCurrentPage] = useState(1); // Current page state
  let { id } = useParams();
  let [orders, setOrders] = useState([]);

  let [salePoints, setSalePoints] = useState([]);
  let getSalePointsData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/points`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setSalePoints(data.data);
  };
  useEffect(() => {
    getSalePointsData()
  }, []);
  let [users, setUsers] = useState([]);
  let [userOptions, setUserOptions] = useState([]);
  let getUsersData = async () => {
    try {
      let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setUsers(data.data);
    } catch (error) {
      toast.error("حدث خطأ ما")
    }
  };
  useEffect(() => {
    getUsersData()
  }, []);
  useEffect(() => {
    try {
      let mapUser = users?.map((user) => ({
        value: `${user.id}`,
        label: `${user.code}`
      }));
      setUserOptions(mapUser);
    } catch (error) {
      toast.error("حدث خطأ ما")
    }
  }, [users]);

  let [searchText, setSearchText] = useState('');
  function handleSearchChange(event) {
    setSearchText(event?.target?.value)

  };
  let [filterPointId, setFilterPointId] = useState('');
  function handlePointChange(event) {
    setFilterPointId(event?.target?.value);

  }
  let [filterUserId, setFilterUserId] = useState('');
  function handleUserChange(selectedOption) {
    setFilterUserId(selectedOption?.value)
  }
  let [filterIsPaid, setFilterIsPaid] = useState('');
  function handleIsPaidChange(event) {
    setFilterIsPaid(event?.target?.value);
  }
  let [filterDate, setFilterDate] = useState('');
  function handleDateChange(event) {
    setFilterDate(event.target.value)
  }
  let getOrderData = async (page = 1) => {
    let orderResult;
    let urlApi = `${process.env.REACT_APP_API_URL}/api/orders/filter?`;
    if (filterUserId !== undefined && filterUserId.length > 0) {
      urlApi += `user_id=${filterUserId}&`
    }
    if (filterIsPaid !== undefined && filterIsPaid.length > 0) {
      urlApi += `is_paid=${filterIsPaid}&`
    }
    if (filterPointId !== undefined && filterPointId.length > 0) {
      urlApi += `point_id=${filterPointId}&`
    }
    if (filterDate !== undefined && filterDate.length > 0) {
      urlApi += `fromDate=${filterDate}&`
    }
    if (searchText !== undefined && searchText.trim().length > 0) {
      urlApi += `key=${searchText}&`

    }

    urlApi += `page=${page}`
    orderResult = await axios.get(urlApi, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
    if (orderResult) {
      setOrders(orderResult.data.data);
      setPagination(orderResult.data.meta); // Set pagination data
      setCurrentPage(page); // Set current page
    }
  };
  useEffect(() => { getOrderData() }, [filterUserId, filterIsPaid, filterPointId, filterDate, searchText]);
  let handlePageChange = (page) => {
    getOrderData(page);
  };

  //get total money with the doctor from all orders
  let [unpaidAmount, setUnpaidAmmount] = useState([]);
  let getUnpiadAmmountForDoctor = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/show/${id}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setUnpaidAmmount(data.data)
  };
  useEffect(() => {
    getUnpiadAmmountForDoctor()
  }, []);
  let [orderId, setOrderId] = useState('');

  let showOrders = () => {
    if (orders.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive ">
          <table dir="rtl" className='table table-bordered table-hover text-center table-responsive-list'>
            <thead className='table-primary no-wrap-heading'>
              <tr>
                <th>رقم</th>
                <th> تاريخ الإنشاء</th>
                <th> نقطة اليبع</th>
                <th>اسم الموظف</th>
                <th>هاتف الموظف</th>
                <th>كود العميل</th>
                <th>المنطقة </th>
                <th>قيمة الأوردر</th>
                <th>الإجمالي</th>
                <th>المدفوع</th>
                <th> الباقي</th>
                <th>سداد </th>
                <th>خيارات </th>

              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => <tr key={order.id}>
                <td data-label="#">{++index}</td>
                <td data-label="تاريخ الإنشاء"  >{order.created_at}</td>
                <td data-label="نقطة البيع">{order?.sale_point?.name}</td>
                <td data-label="اسم الموظف">{order?.delivery_man?.name}</td>
                <td data-label="هاتف الموظف">{order?.delivery_man?.phone}</td>
                <td data-label="كود العميل">{order?.customer?.code}</td>
                <td data-label=" المنطقة">{order?.area?.name}</td>
                <td data-label="قيمة الأوردر">{order.cost}</td>
                <td data-label="الإجمالي">{order.total_ammount}</td>
                <td data-label="المدفوع">{order.paid}</td>
                <td data-label="الباقي">{order.unpaid}</td>
                <td data-label="سداد" ><i className="bi bi-safe p-1 mx-1 rounded text-white" onClick={() => {
                  openModal()
                  setOrderId(order.id)
                }} style={{ backgroundColor: '#2a55a3' }}></i></td>
                <td data-label="خيارات">
                  <NavLink to={`/doctorOrders/edite/${order.id}`} >
                    <i className='bi bi-pencil-square text-bg-primary mx-1  p-1 rounded'></i>
                  </NavLink>
                  <NavLink to={`/doctorOrders/details/${order.id}`} >
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
          {orders.length <= 0 && searchText.length <= 0 && filterPointId.length <= 0 && filterUserId.length <= 0 && filterIsPaid.length <= 0 ?
            <i className='fa fa-spinner fa-spin  fa-5x'></i>
            : <div className='alert alert-danger w-50 text-center'>لا يوجد أوردرات</div>
          }
        </div>)

    }
  };
  let [openPaidModal, setOpenPaidModal] = useState(false)

  function openModal() {
    setOpenPaidModal(true);
  };
  function closeModal() {
    setOpenPaidModal(false);
  };
  let [paid, setPaid] = useState({
    paid_value: '',
  });
  let getInputValue = (event) => {
    let myPaids = { ...paid }; //deep copy
    myPaids[event.target.name] = event?.target?.value;
    setPaid(myPaids);
  };

  let sendUnpaidAmountToApi = async (ordId) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/orders/pay/${ordId}`, paid, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      toast.success(res.data.message);
      setPaid({ paid_value: '' });
    }).catch((errors) => {
      toast.error(errors?.response?.data?.message);
    })
  };
  let validatePaidsForm = () => {
    const schema = Joi.object({
      paid_value: Joi.string().required().messages({
        'string.empty': 'القيمة المسددة مطلوبة',
        'any.required': 'القيمة المسددة مطلوبة',
      }),
    });
    return schema.validate(paid, { abortEarly: false });
  };

  let submitUnpaidAmountToApi = (e) => {
    e.preventDefault();
    let validation = validatePaidsForm();
    if (!validation.error) {
      sendUnpaidAmountToApi(orderId)
    } else {
      try {
        validation.error.details.map((err) => {
          toast.error(err.message);
        })
      } catch (e) {
        toast.error("حدث خطأ ما");
      }
    }

  };

  let showSalePoints = () => {
    if (salePoints.length > 0) {
      return (
        <div >
          {salePoints.map((point) => <div key={point.id}>
            <div className={`row`}>
              <div className="col-4 ">
                <p className='bg-secondary p-1 text-white rounded'>{point?.name}</p>
              </div>
              <div className="col-4 ">
                <p className='bg-secondary p-1 text-white rounded '>{point?.unpaid_balance}</p>
              </div>
            </div>
          </div>)}

        </div>
      )
    } else {
      return (
        <div className='h-75' >
          <div className=' d-flex justify-content-center h-100  align-items-center' >
            <i className='fa fa-spinner fa-spin fa-2x '></i>
          </div>
        </div>
      )
    }
  }
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Doctor Orders</title>
      </Helmet>

      <div className='container'>
        <div className=" my-3 text-center row mx-2  " dir='rtl'>
          <div className="col-md-2 mb-1">
            <Select
              options={userOptions}
              onChange={handleUserChange}
              isSearchable={true}
              placeholder="اختر موظف"
            />
          </div>
          <div className="col-md-2 mb-1">
            <input type="date" className='form-control mt-1' onChange={handleDateChange} />
          </div>
          <div className="col-md-3 mb-1">
            <select name="is_paid" defaultValue={0} className='form-control' id="role"
              onChange={handleIsPaidChange}>
              <option value={0} hidden disabled>اختر مسدد أو غير مسدد </option>
              <option value={"paid"} >مسدد</option>
              <option value={"unpaid"} >غير مسدد</option>
            </select>
          </div>
          <div className="col-md-2 mb-1">
            <select name="point_id" defaultValue={0} className='form-control' id="point_id"
              onChange={handlePointChange}>
              <option value={0} hidden disabled>اختر نقطة بيع</option>
              {salePoints.map((point) => <option key={point.id} value={point.id} >{point.name}</option>)}
            </select>
          </div>
          <div className="col-md-3 mb-1">
            <NavLink to='/doctorpoporders/add' className='btn btn-danger ' >إضافة أوردر للطيارين </NavLink>
          </div>
          <div className="col-md-2">
            <NavLink to={`/doctorOrders/add/${id}`} className='btn btn-primary mb-1' >إضافة أوردر</NavLink>
          </div>
          <div className="col-md-3 mb-2">
            <NavLink to='/doctorpoporders' className='btn btn-warning' > الأوردرات المعلقة  </NavLink>
          </div>
          <div className="col-md-3  bg-secondary-subtle  rounded mt-1 ">
              <span className='text-bg-danger rounded p-1 fw-bolder d-block' >إجمالي المبلغ المطلوب سداده</span>
              <span className='fw-bolder '>{unpaidAmount?.unpaidAmount}</span>
            </div>
          <div className="col-md-12 row m-auto d-flex " >
            <div className="col-md-4 mt-1">
              {showSalePoints()}
            </div>
            <div className="col-md-6 mx-auto">
              <input type="text" className='form-control text-end mt-1' placeholder='بحث عن أوردر...' onChange={handleSearchChange} />
            </div>
          
          </div>
        </div>
      </div>
      {openPaidModal && <div id="paidModal" className={`${styles.modal}`}>
        <div className={`${styles.modal_content}`}>
          <span className={`${styles.close} fs-3`} onClick={closeModal} >&times;</span>
          <form onSubmit={submitUnpaidAmountToApi} >
            <div className="my-2">
              <label htmlFor="paid" className='form-label mt-4'>القيمة المسددة</label>
              <input type="text" name="paid_value" id="paid" className='form-control' onChange={getInputValue} />
            </div>
            <button type='submit' className=' btn text-bg-success'>سدد</button>

          </form>
        </div>
      </div>}

      <div className="text-center mb-3">
        <Pagination pagination={pagination} currentPage={currentPage} handlePageChange={handlePageChange} />

      </div>
      {showOrders()}

    </>
  )
}
