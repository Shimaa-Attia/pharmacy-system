import axios from 'axios';
import Joi from 'joi';
import React, { useEffect, useState } from 'react'
import { NavLink,  useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Clients from '../Clients/Clients';


export default function AddOrder() {

    let formElement = document.querySelectorAll('form input');
    let textarea = document.querySelector('form textarea');

    let accessToken = localStorage.getItem('userToken');
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
        let { data } = await axios.get(`http://pharma-erp.atomicsoft-eg.com/api/users`);
        setUsers(data.data);

    };
    useEffect(() => {
        getUserData()
    }, []);

    let getClientData = async () => {
        let { data } = await axios.get(`http://pharma-erp.atomicsoft-eg.com/api/customers`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        setClients([...data.data]);
    };

    useEffect(() => {
        getClientData()
    }, []);

    // let [contacts, setContacts] = useState([]);

    // let getContactValue = async () => {
    //     let { data } = await axios.get(`http://pharma-erp.atomicsoft-eg.com/api/customeres/contact/${id}`, {
    //         headers: {
    //             "Authorization": `Bearer ${accessToken}`
    //         }
    //     });

    // }
    // useEffect(() => { getContactValue() }, []);
    let getInputValue = (event) => {
        let myOrders = { ...orders }; //deep copy
        myOrders[event.target.name] = event.target.value;
        setOrders(myOrders);
        console.log(event.target.value);
    };

    let sendOrderDataToApi = async () => {
        await axios.post(`http://pharma-erp.atomicsoft-eg.com/api/orders`, orders).then((res) => {
            toast.success(res.data.message, {
                position: 'top-center'
            });
            setIsLoading(false);

        }).catch((errors) => {
            setIsLoading(false);
            const errorList = errors?.response?.data?.error;
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
            totalAmmount: Joi.number(),
            cost: Joi.number(),
            notes: Joi.string(),
        });
        return schema.validate(orders, { abortEarly: false });
    };
    let submitOrderForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let validation = validateOrderForm();
        if (!validation.error) {

            sendOrderDataToApi().finally(() => {

                formElement.forEach((el) => {
                    el.value = '';
                });
                textarea.value = '';
                document.querySelectorAll("mySelect").selectedIndex = "0";

            });

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
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة أوردر </h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form onSubmit={submitOrderForm} >
                    <div className="row gy-3">
                        <div className="col-md-4">
                            <label htmlFor="user_id" className='form-label'>كود الطيار أو الاسم</label>

                            <select name="user_id" defaultValue={0} className='form-control mySelect' id="user_id"
                                onChange={getInputValue}>
                                <option value={0} hidden disabled>اختار</option>
                                {users.map((user) => <option key={user.id} value={user.id} >{user.code} {user.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="customer_id" className='form-label'>كود العميل أو الاسم</label>
                            <select name="customer_id" defaultValue={0} className='form-control mySelect' id="customer_id"
                                onChange={getInputValue}>
                                <option value={0} hidden disabled>اختر</option>
                                {clients.map((client) => <option key={client.id} value={client.id} >{client.code} {client.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="customer_phone" className='form-label'>أرقام الهواتف للعميل</label>
                            <select name="customer_phone" defaultValue={0} className='form-control mySelect' id="customer_phone"
                                onChange={getInputValue}>
                                <option value={0} hidden disabled>اختار</option>

                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="customer_address" className='form-label'>عناوين العميل</label>
                            <select name="customer_address" defaultValue={0} className='form-control mySelect' id="customer_address"
                                onChange={getInputValue}>
                                <option value={0} hidden disabled>اختار</option>

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
                            <NavLink to='/orders' className='btn  btn-secondary form-control fs-5'>رجوع</NavLink>

                        </div>
                    </div>
                </form >
            </div >
        </>
    )
}
