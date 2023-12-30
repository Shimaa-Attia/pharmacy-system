import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';
import CreatableSelect from 'react-select/creatable';


export default function EditeOrder() {
  let { accessToken } = useContext(AuthContext);
  let { id } = useParams();
  let navigate = useNavigate();
  let [isLoading, setIsLoading] = useState(false);
  let [users, setUsers] = useState([]);
  let [clients, setClients] = useState([]);
  let [orders, setOrders] = useState({
    user_id: '',
    customer_code: '',
    total_ammount: '',
    cost: '',
    notes: '',
    sale_point_id: '',
    paid:''
  });
  let getInputValue = (event) => {
    let myOrders = { ...orders }; 
    myOrders[event.target.name] = event.target.value;
    setOrders(myOrders);
  };

  let[orderData , setOrderData] = useState([])
  let getOrder = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/show/${id}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setOrderData(data.data)
    
    console.log(data.data.cost);
   
  };
  useEffect(() => {
    getOrder()
  }, []);

  let [inputValue, setInputValue] = useState(orderData.cost)

  let getUserData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setUsers(data.data)

  };
  useEffect(() => {
    getUserData()
  }, []);
  let getClientData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setClients([...data.data]);
  };
  useEffect(() => {
    getClientData()
  }, []);


  let sendEditedDataToApi = async () => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, orders, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      console.log(res);
      toast.success(res.data.message, {
        position: 'top-center'
      });
      setIsLoading(false);
      navigate('/orders')
    }).catch((errors) => {
      console.log(errors);
      setIsLoading(false);
      const errorList = errors?.response?.data?.message;
      if (errorList !== undefined) {
        Object.keys(errorList).map((err) => {
          errorList[err].map((err) => {
            toast.error(err);
          })
        });
      } else {
        toast.error("حدث خطأ ما");
      }
    });
  };

  let validateEditedFrom = () => {
    const schema = Joi.object({
      user_id: Joi.number().required(),
      customer_code: Joi.string().required(),
      total_ammount: Joi.number().required(),
      cost: Joi.number().required(),
      sale_point_id: Joi.number().required(),
      paid:Joi.string().empty(''),
      notes: Joi.string().empty(""),
    });
    return schema.validate(orders, { abortEarly: false });
  };
  let editedOrederSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    sendEditedDataToApi();

    let validation = validateEditedFrom();
    if (!validation.error) {
      sendEditedDataToApi();
    } else {
      setIsLoading(false);
      try {
        validation.error.details.map((err) => {
          toast.error(err.message);
        })
      } catch (e) {
        toast.error("حدث خطأ ما");
      }
    }

  };
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

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Edite Order</title>
      </Helmet>
      <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>تعديل الأوردر</h3>
      <div className="mx-5 p-3 rounded rounded-3 bg-white">
        <form onSubmit={editedOrederSubmit} >
          <div className="row gy-3">
            <div className="col-md-4">
              <label htmlFor="user_id" className='form-label'>كود  الموظف </label>
              <input type="text" name="user_id" id="user_id" className='form-control'
                onChange={getInputValue}
                
              
                 />
            </div>
            <div className="col-md-4">
              <label htmlFor="customer_code" className='form-label'>كود العميل  </label>
              <input type="text" name="customer_code" id="customer_code" className='form-control'
                onChange={getInputValue}
                
                 />
            </div>
            <div className="col-md-4">
              <label htmlFor="sale_point_id" className='form-label'>نقطة البيع </label>
              <select name="sale_point_id" defaultValue={0} className='form-control' id="sale_point_id"
                onChange={getInputValue}>
                  <option value={0} hidden disabled>اختار</option>
                {salePoints.map((point) => <option key={point.id}  value={point.id}>{point.name}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="cost" className='form-label'>قيمة الأوردر </label>
              <input type="text" className='form-control' name="cost" id="cost"
                onChange={getInputValue}
                defaultValue={orderData?.cost}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="total_ammount" className='form-label'> إجمالي المبلغ مع الطيار </label>
              <input type="text" className='form-control' name="total_ammount" id="total_ammount"
                onChange={getInputValue}
                defaultValue={orderData?.total_ammount}
                />
            </div>
            <div className="col-md-4">
              <label htmlFor="paid" className='form-label'>القيمة المسددة </label>
              <input type="text" className='form-control' name="paid" id="paid"
                onChange={getInputValue}
                defaultValue={orderData?.paid}
                />
            </div>
            <div className="col-md-12">
              <label htmlFor="notes" className='form-label'>ملاحظات</label>
              <textarea type='text' name="notes" id="notes" className='form-control'
                onChange={getInputValue}
                defaultValue={orderData?.notes}
                 />
            </div>
            <div className="col-md-3">
              <button type='submit' className='btn btn-primary form-control fs-5'>
                {isLoading == true ? <i className='fa fa-spinner fa-spin'></i> : 'تعديل'}
              </button>
            </div>
            <div className="col-md-3">
              <NavLink to='/orders' className='btn  btn-secondary form-control fs-5'>رجوع</NavLink>

            </div>
          </div>
        </form >
      </div >


    </>
  )
}
