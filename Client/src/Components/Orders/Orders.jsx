import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import styles from '../Orders/Orders.module.css'
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';
import { toast } from 'react-toastify';
import Joi from 'joi';
import Select from 'react-select';

export default function Orders() {
  let { accessToken } = useContext(AuthContext);
  let formInput = document.getElementById('paid');
  let [orders, setOrders] = useState([]);
  let [unpaid, setUnpaid] = useState('')
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
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setUsers(data.data);
  };
  useEffect(() => {
    getUsersData()
  }, []);
  useEffect(() => {
    let mapUser = users?.map((user) => ({
      value: `${user.id}`,
      label: `${user.code}`
    }));
    setUserOptions(mapUser);

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

    setFilterUserId(selectedOption.value)
  }
  let [filterIsPaid, setFilterIsPaid] = useState('');
  function handleIsPaidChange(event) {
    setFilterIsPaid(event?.target?.value);
  }
  let [filterDate, setFilterDate] = useState('');
  function handleDateChange(event) {
    setFilterDate(event.target.value)
  }

  let getOrderData = async () => {
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
      urlApi += `key=${searchText}`
      console.log(urlApi);
    }
    orderResult = await axios.get(urlApi, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
    if (orderResult) {
      setOrders(orderResult.data.data)
    }
  };
  useEffect(() =>
   { getOrderData() },
    [filterUserId, filterIsPaid, filterPointId,filterDate , searchText]);

  let [orderId, setOrderId] = useState(''); // for making orders paids on the same system
  let sendIsPaidOnThOtherSystemToApi = async (ordId) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/orders/isPaid_theOtherSystem/${ordId}`, {}, {
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
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive">
          <table dir="rtl"  className='table  table-hover text-center align-middle table-responsive-list '>
            <thead className='table-primary  no-wrap-heading'>
              <tr>
                <th> تاريخ الإنشاء</th>
                <th> نقطة اليبع</th>
                <th>اسم الموظف</th>
                <th>هاتف الموظف</th>
                <th>كود العميل</th>
                <th>قيمة الأوردر</th>
                <th>الإجمالي</th>
                <th>المدفوع</th>
                <th> الباقي</th>
                <th>سداد </th>
                <th>خيارات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => <tr key={order.id}>
                <td data-label="تاريخ الإنشاء"  >{order.created_at}</td>
                <td data-label="نقطة البيع">{order?.sale_point?.name}</td>
                <td data-label="اسم الموظف">{order?.delivery_man?.name}</td>
                <td data-label="هاتف الموظف">{order?.delivery_man?.phone}</td>
                <td data-label="كود العميل">{order?.customer?.code}</td>
                <td data-label="قيمة الأوردر">{order.cost}</td>
                <td data-label="الإجمالي">{order.total_ammount}</td>
                <td data-label="المدفوع">{order.paid}</td>
                <td data-label="الباقي">{order.unpaid}</td>
                <td data-label="سداد" ><i className="bi bi-safe p-1 mx-1 rounded text-white" onClick={() => {
                  openModal()
                  setOrderId(order.id)
                }} style={{ backgroundColor: '#2a55a3' }}></i></td>
                <td data-label="خيارات" style={{ minWidth: '150px' }}>
                  <NavLink to={`/orders/delete/${order.id}`} >
                    <i className='bi bi-trash text-bg-danger p-1  rounded'></i>
                  </NavLink>
                  <NavLink to={`/orders/edite/${order.id}`} >
                    <i className='bi bi-pencil-square text-bg-primary mx-1  p-1 rounded'></i>
                  </NavLink>
                  <NavLink to={`/orders/details/${order.id}`} >
                    <i className='bi bi-list-ul text-bg-success mx-1  p-1 rounded'></i>
                  </NavLink>
                  {order.isPaid_theOtherSystem ? <i className='bi bi-check-circle-fill text-success fs-4'
                    onClick={() => sendIsPaidOnThOtherSystemToApi(order.id)} ></i>
                    : <i className='bi bi-x-circle-fill text-danger fs-4 '
                      onClick={() => sendIsPaidOnThOtherSystemToApi(order.id)} ></i>}
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
           {orders.length <= 0 && searchText.length <= 0 && filterPointId.length <= 0 && filterUserId.length <= 0 && filterIsPaid.length <= 0 && filterDate.length <=0 ?
            <i className='fa fa-spinner fa-spin  fa-5x'></i>
             : <div className='alert alert-danger w-50 text-center'>لا يوجد أوردرات</div>
          }
        </div>
      )
    }
  };

  
  const paidModal = document.getElementById('paidModal');
  function openModal() {
    paidModal.style.display = 'block';
  };
  function closeModal() {
    paidModal.style.display = 'none';
  };

  let [paid, setPaid] = useState({
    paid_value: '',
  });
  let getInputValue = (event) => {
    let myPaids = { ...paid }; //deep copy
    myPaids[event.target.name] = event.target.value;
    setPaid(myPaids);
  };

  let sendUnpaidAmountToApi = async (ordId) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/orders/pay/${ordId}`, paid, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      toast.success(res.data.message);
      formInput.value = '';
      getOrderData()
    }).catch((errors) => {
      toast.error(errors?.response?.data?.message);

    })
  };
  let validatePaidsForm = () => {
    const schema = Joi.object({
      paid_value: Joi.string().required(),
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

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Orders</title>
      </Helmet>
      <div className=" my-3 text-center row mx-2  " dir='rtl'>
        <div className="col-md-3 mb-1">
          <Select
            options={userOptions}
            onChange={handleUserChange}
            isSearchable={true}
            placeholder="اختر موظف"
          />
        </div>
        <div className="col-md-3 mb-1">
          <select name="is_paid" defaultValue={0} className='form-control' id="role"
            onChange={handleIsPaidChange}>
            <option value={0} hidden disabled>اختر مسدد أو غير مسدد </option>
            <option value={"paid"} >مسدد</option>
            <option value={"unpaid"} >غير مسدد</option>
          </select>
        </div>
        <div className="col-md-3 mb-1">
          <select name="point_id" defaultValue={0} className='form-control' id="point_id"
            onChange={handlePointChange}>
            <option value={0} hidden disabled>اختر نقطة بيع</option>
            {salePoints.map((point) => <option key={point.id} value={point.id} >{point.name}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <NavLink to='/orders/add' className='btn btn-primary mb-1' >إضافة أوردر</NavLink>
        </div>
        <div className="col-md-6" >
          <input type="text" className='form-control text-end mt-1 ' placeholder='بحث عن أوردر...' onChange={handleSearchChange} />
        </div>
        <div className="col-md-4 mb-1">
          <input type="date" className='form-control mt-1' onChange={handleDateChange} />
        </div>
      </div>
      {/* paid modal */}
      <div id="paidModal" className={`${styles.modal} `}>
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
      </div>
      {showOrders()}
    </>
  )
}
