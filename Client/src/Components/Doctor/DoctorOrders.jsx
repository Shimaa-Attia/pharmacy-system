import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';
import styles from '../Doctor/DoctorOrders.module.css'
import { toast } from 'react-toastify';
import Joi from 'joi';



export default function DoctorOrders() {
  let formInput = document.getElementById('paid');

  let { accessToken } = useContext(AuthContext);
  let { id } = useParams();
  let [orders, setOrders] = useState([]);
  let [searchText, setSearchText] = useState('');
  function handleSearchChange(event) {
    setSearchText(event.target.value)
  };
  let getOrderData = async () => {
    let searchResult;
    if (searchText !== undefined && searchText.trim().length > 0) {
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/search/${searchText.trim()}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setOrders(searchResult.data.data);
    } else {
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      console.log(searchResult);
      setOrders(searchResult.data.data);
    }
    
  };
  useEffect(() => { getOrderData() }, [searchText]);

    //get total money with the doctor from all orders
   let [unpaidAmount , setUnpaidAmmount] = useState([]);
    let getUnpiadAmmountForDoctor = async () => {
      let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/show/${id}` , {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setUnpaidAmmount(data.data)
    };
  useEffect(()=>{
    getUnpiadAmmountForDoctor()
  },[]);
  let [orderId, setOrderId] = useState('');

  let showOrders = () => {
    if (orders.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 ">
          <table dir="rtl" responsive='sm' className='table table-bordered table-hover text-center table-responsive-list'>
            <thead className='table-primary'>
              <tr>
                <th>رقم</th>
                <th>تاريخ الإنشاء</th>
                <th>كود الموظف</th>
                <th>كود العميل</th>
                <th>قيمة الأوردر</th>
                <th>إجمالي المبلغ</th>
                <th>نقطة البيع</th>
                <th>المطلوب سداده</th>
                <th>سداد </th>   
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => <tr key={order.id}>
          
                <td data-label="#">{++index}</td>
                <td data-lable="تاريخ الإنشاء" >{order?.created_at}</td>
                <td data-label="كود الموظف">{order?.delivery_man?.code}</td>
                <td data-label="كود العميل">{order?.customer?.code}</td>
                <td data-label="قيمة الأوردر">{order?.cost}</td>
                <td data-label=" إجمالي المبلغ">{order?.total_ammount}</td>
                <td data-label="نقطة البيع">{order?.sale_point?.name}</td>
                <td data-label="المطلوب سداده">{order?.unpaid}</td>
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
          <i className='fa fa-spinner fa-spin  fa-5x'></i>
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
        <div className=" my-3 text-center row   ">
          <div className="col-md-4 ">
            <NavLink to={`/doctorlayout/add/${id}`} className='btn btn-primary mb-1' >إضافة أوردر</NavLink>
          </div>
          <div className="col-md-4">
            <input type="text" className='form-control text-end mt-1 ' placeholder=' ...بحث عن أوردر ' onChange={handleSearchChange} />
          </div>
          <div className="col-3 m-auto bg-secondary-subtle mt-1 rounded">
            <p className=' text-bg-danger rounded p-1 fw-bolder ' >إجمالي المبلغ المطلوب سداده</p>
            <p className='fw-bolder '>{unpaidAmount?.unpaidAmount}</p>
          </div>
        </div>
      </div>
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
