import axios from 'axios';
import Joi from 'joi';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function EditeOrder() {


  let accessToken = localStorage.getItem('userToken');
  let { id } = useParams();
  let navigate = useNavigate();
  let [isLoading, setIsLoading] = useState(false);
  let [users, setUsers] = useState([]);
  let [clients, setClients] = useState([]);
  let [orders, setOrders] = useState({
    user_id: '',
    customer_address: '',
    customer_phone: '',
    customer_id: '',
    totalAmmount: '',
    cost: '',
    notes: '',

  });

  let getUserData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`);
    setUsers(data.data)

    // data.data.map((user) => {
    //     if (user.role === 'delivery') {
    //         return setUsers([...users, user]);
    //     }
    // });
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

  let [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (orders.customer_id === '') {
      return;
    } else {
      getContactValue(orders.customer_id);
    }

  }, [orders.customer_id]);
  let getContactValue = async (id) => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/contact/${id}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    setContacts(data);
  };
  let getInputValue = (event) => {
    let myOrders = { ...orders }; //deep copy
    myOrders[event.target.name] = event.target.value;
    setOrders(myOrders);

  };
  let sendEditedDataToApi = async () => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, orders, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      toast.success(res.data.message, {
        position: 'top-center'
      });
      setIsLoading(false);

      navigate('/orders')
    }).catch((errors) => {
      setIsLoading(false);
      const errorList = errors?.response?.data?.msg;
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
      customer_address: Joi.string().required(),
      customer_phone: Joi.string().required(),
      customer_id: Joi.number().required(),
      totalAmmount: Joi.number().empty(''),
      cost: Joi.number().empty(''),
      notes: Joi.string().empty(''),
    });
    return schema.validate(orders, { abortEarly: false });
  };
  let editedOrederSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
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
                            <label htmlFor="user_id" className='form-label'>كود الطيار أو الاسم</label>
                            <select name="user_id" defaultValue={0} className='form-control ' id="user_id"
                                onChange={getInputValue}>
                                <option value={0} hidden disabled>اختار</option>
                                {users.map((user) => <option key={user.id} value={user.id} >{user.code} {user.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="customer_id" className='form-label'>كود العميل أو الاسم</label>
                            <select name="customer_id" defaultValue={0} className='form-control ' id="customer_id"
                                onChange={getInputValue}>
                                <option value={0} hidden disabled>اختر</option>
                                {clients.map((client) => <option key={client.id} value={client.id} >{client.code} {client.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="customer_phone" className='form-label'>أرقام الهواتف للعميل</label>
                            <select name="customer_phone" defaultValue={0} className='form-control ' id="customer_phone"
                                onChange={getInputValue}>
                                <option value={0} hidden disabled>اختار</option>
                                {contacts?.phones ? contacts?.phones.map((phone) => <option key={phone.id} value={phone.value} > {phone.value}</option>) : null}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="customer_address" className='form-label'>عناوين العميل</label>
                            <select name="customer_address" defaultValue={0} className='form-control ' id="customer_address"
                                onChange={getInputValue}>
                                <option value={0} hidden disabled>اختار</option>
                                {contacts?.addresses ? contacts?.addresses.map((address) => <option key={address.id} value={address.value} > {address.value}</option>) : null}

                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="cost" className='form-label'>قيمة الأوردر </label>
                            <input type="number" className='form-control' name="cost" id="cost" onChange={getInputValue}  />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="totalAmmount" className='form-label'> إجمالي المبلغ مع الطيار </label>
                            <input type="number" className='form-control' name="totalAmmount" id="totalAmmount" onChange={getInputValue} />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="notes" className='form-label'>ملاحظات</label>
                            <textarea name="notes" id="notes" className='form-control' onChange={getInputValue} />
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
