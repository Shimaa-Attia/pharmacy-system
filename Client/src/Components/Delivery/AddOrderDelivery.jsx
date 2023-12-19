import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';

export default function AddOrderDelivery() {
    let { accessToken } = useContext(AuthContext);
    let formInputs = document.querySelectorAll('form input');
    let formSelects = document.querySelectorAll('form select');
    let textarea = document.querySelector('form textarea');
    let [isLoading, setIsLoading] = useState(false);
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
    let [users, setUsers] = useState([]);
    let getUserData = async () => {

        let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/auth`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        setUsers(data);
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
  
    let sendOrderDataToApi = async () => {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, orders, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((res) => {
            console.log(res);
            console.log('res');
            toast.success(res.data.message, {
                position: 'top-center'
            });
            setIsLoading(false);
            formInputs.forEach((el) => {
                el.value = '';
            });
            formSelects.forEach((el) => {
                el.selectedIndex = '0';
            });
            textarea.value = '';


        }).catch((errors) => {
            console.log(errors);
            console.log('error');
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
    let validateOrderForm = () => {
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
    let submitOrderForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
       
        let validation = validateOrderForm();
        if (!validation.error) {

            sendOrderDataToApi();
        } else {
            console.log('invalid');
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
    // let [hideInput, setHideInput] = useState(false)

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Add Order</title>
            </Helmet>
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة أوردر </h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form onSubmit={submitOrderForm} >
                    <div className="row gy-3">

                        <div className="col-md-4 ">
                            <input type="text" name="user_id" value={users.id} id='user_id'  />
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
                            <input type="number" className='form-control' name="cost" id="cost" onChange={getInputValue} />
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
                                {isLoading == true ? <i className='fa fa-spinner fa-spin'></i> : 'إضافة'}
                            </button>
                        </div>
                        <div className="col-md-3">
                            <NavLink to={`/deliverylayout/deliveryOrders/${users.id}`} className='btn  btn-secondary form-control fs-5'>رجوع</NavLink>

                        </div>
                    </div>
                </form >
            </div >
        </>
    )
}
