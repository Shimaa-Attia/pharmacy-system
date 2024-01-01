import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';
import styles from '../Doctor/DoctorOrders.module.css'
import { toast } from 'react-toastify';
import Joi from 'joi';
import Select from 'react-select';



export default function DoctorOrders() {
  let formInput = document.getElementById('paid');
  let { accessToken } = useContext(AuthContext);
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
  let [filterUsertId, setFilterUserId] = useState('');
  function handleUserChange(selectedOption) {

    setFilterUserId(selectedOption.value)
  }
  let [filterIsPaid, setFilterIsPaid] = useState('');
  function handleIsPaidChange(event) {
    setFilterIsPaid(event?.target?.value);

  }
  let getOrderData = async () => {
    let orderResult;
    if (filterPointId !== undefined && filterPointId.length > 0
      && (filterUsertId === undefined || filterUsertId === '')
      && (filterIsPaid === undefined || filterIsPaid === '')) {

      orderResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/filter?point_id=${filterPointId}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setOrders(orderResult.data.data);
    } else if (searchText !== undefined && searchText.trim().length > 0) {

      orderResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/search/${searchText.trim()}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setOrders(orderResult.data.data);

    } else if (filterUsertId !== undefined && filterUsertId.length > 0
      && (filterPointId === undefined || filterPointId === '')
      && (filterIsPaid === undefined || filterIsPaid === '')) {

      orderResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/filter?user_id=${filterUsertId}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setOrders(orderResult.data.data)

    } else if (filterIsPaid !== undefined && filterIsPaid.length > 0
      && (filterUsertId === undefined || filterUsertId === '')
      && (filterPointId === undefined || filterPointId === '')
    ) {
      orderResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/filter?is_paid=${filterIsPaid}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      setOrders(orderResult.data.data)

    } else if (filterPointId !== undefined && filterPointId.length > 0
      && (filterUsertId !== undefined && filterUsertId.length > 0)
      && (filterIsPaid === undefined || filterIsPaid === '')) {
      orderResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/filter?point_id=${filterPointId}&user_id=${filterUsertId}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setOrders(orderResult.data.data);

    } else if (filterPointId !== undefined && filterPointId.length > 0
      && (filterIsPaid !== undefined && filterIsPaid.length > 0)
      && (filterUsertId === undefined || filterUsertId === '')) {
      orderResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/filter?point_id=${filterPointId}&is_paid=${filterIsPaid}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setOrders(orderResult.data.data);

    }
    else if (filterIsPaid !== undefined && filterIsPaid.length > 0
      && (filterUsertId !== undefined && filterUsertId.length > 0)
      && (filterPointId === undefined || filterPointId === '')) {
      orderResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/filter?user_id=${filterUsertId}&is_paid=${filterIsPaid}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setOrders(orderResult.data.data);

    }
    else if (filterIsPaid !== undefined && filterIsPaid.length > 0
      && (filterUsertId !== undefined && filterUsertId.length > 0)
      && (filterPointId !== undefined && filterPointId.length > 0)) {
      orderResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/filter?user_id=${filterUsertId}&is_paid=${filterIsPaid}&point_id=${filterPointId}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setOrders(orderResult.data.data);

    }
    else {
      orderResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
    }
    setOrders(orderResult.data.data);
  };
  useEffect(() => { getOrderData() }, [searchText, filterPointId, filterUsertId, filterIsPaid]);

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
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 ">
          <table dir="rtl" responsive='sm' className='table table-bordered table-hover text-center table-responsive-list'>
            <thead className='table-primary'>
              <tr>
                <th>رقم</th>
                <th> تاريخ الإنشاء</th>
                <th> نقطة اليبع</th>
                <th>اسم الموظف</th>
                <th>كود العميل</th>
                <th>قيمة الأوردر</th>
                <th>الإجمالي</th>
                <th>المدفوع</th>
                <th> الباقي</th>
                <th>سداد </th>

              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => <tr key={order.id}>
                <td data-label="#">{++index}</td>
                <td data-label="تاريخ الإنشاء"  >{order.created_at}</td>
                <td data-label="نقطة البيع">{order?.sale_point?.name}</td>
                <td data-label="اسم الموظف">{order?.delivery_man?.name}</td>
                <td data-label="اسم العميل">{order?.customer?.code}</td>
                <td data-label="قيمة الأوردر">{order.cost}</td>
                <td data-label="الإجمالي">{order.total_ammount}</td>
                <td data-label="المدفوع">{order.paid}</td>
                <td data-label="الباقي">{order.unpaid}</td>
                <td data-label="سداد" ><i className="bi bi-safe p-1 mx-1 rounded text-white" onClick={() => {
                  openModal()
                  setOrderId(order.id)
                }} style={{ backgroundColor: '#2a55a3' }}></i></td>
              </tr>
              )}
            </tbody>
          </table>
        </div>
      )
    } else {
      return (
        <div className=' d-flex justify-content-center  height-calc-70 align-items-center' >
          {orders.length <= 0 && searchText.length <= 0 && filterPointId.length <= 0 && filterUsertId.length <= 0 && filterIsPaid.length <= 0 ?
            <i className='fa fa-spinner fa-spin  fa-5x'></i>
            : <div className='alert alert-danger w-50 text-center'>لا يوجد أوردرات</div>
          }
        </div>)

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
        <title>Delivery Orders</title>
      </Helmet>

      <div className='container'>
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
            <NavLink to={`/doctorlayout/add/${id}`} className='btn btn-primary mb-1' >إضافة أوردر</NavLink>
          </div>
          <div className="col-md-12 m-auto d-flex " >
            <div className="col-md-3 m-auto bg-secondary-subtle mt-1 rounded">
              <div className=' text-bg-danger rounded p-1 fw-bolder ' >إجمالي المبلغ المطلوب سداده</div>
              <div className='fw-bolder p-1 '>{unpaidAmount?.unpaidAmount}</div>
            </div>
            <div className="col-md-6">
              <input type="text" className='form-control text-end mt-1' placeholder='بحث عن أوردر...' onChange={handleSearchChange} />
            </div>
          </div>
        </div>
      </div>
      <div id="paidModal" className={`${styles.modal}`}>
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
