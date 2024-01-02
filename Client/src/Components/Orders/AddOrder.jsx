import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

export default function AddOrder() {
    let { accessToken } = useContext(AuthContext);
    let formInputs = document.querySelectorAll('form input');
    let formSelects = document.querySelectorAll('form select');
    let textarea = document.querySelector('form textarea');
    let [isLoading, setIsLoading] = useState(false);
    let [users, setUsers] = useState([]);
    let [clients, setClients] = useState([]);
    let [orders, setOrders] = useState({
        user_id: '',
        // customer_address: '',
        // customer_phone: '',
        customer_code: '',
        total_ammount: '',
        cost: '',
        notes: '',
        sale_point_id: ''

    });
    let [userOptions, setUserOptions] = useState([]);
    let getUserData = async () => {
        try {
            let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setUsers(data.data);
        } catch (error) {
            toast.error('حدث خطأ ما.')
        }


    };
    useEffect(() => {
        getUserData()
    }, []);
    useEffect(() => {
        let mapUser = users?.map((user) => ({
            value: `${user.id}`,
            label: `${user.code}`
        }));
        setUserOptions(mapUser);
    }, [users]);
    let [clientOptions, setClientOptions] = useState([]);
    let getClientData = async () => {
        try {
            let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setClients([...data.data]);
        } catch (error) {
            toast.error('حدث خطأ ما.')
        }
    };

    useEffect(() => {
        getClientData()
    }, []);

    useEffect(() => {
        let mapClient = clients?.map((client) => ({
            value: `${client?.id}`,
            label: `${client?.code}`
        }));
        setClientOptions(mapClient);
    }, [clients]);
    //get contac info (phones and adresess)
    // let [contacts, setContacts] = useState([]);
    // useEffect(() => {
    //     if (orders.customer_id === '') {
    //         return;
    //     } else {
    //         getContactValue(orders.customer_id);
    //     }

    // }, [orders.customer_id]);
    // let getContactValue = async (id) => {
    //     let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/contact/${id}`, {
    //         headers: {
    //             "Authorization": `Bearer ${accessToken}`
    //         }
    //     });

    //     setContacts(data);
    // };
    let getSelectedUser = (selectedOption) => {
        setOrders({
            ...orders,
            user_id: selectedOption?.value,
        });
    };
    let getSelectedClient = (selectedOption) => {
        setOrders({
            ...orders,
            customer_code: selectedOption?.value,
        });
    };

    let getInputValue = (event) => {
        let myOrders = { ...orders }; //deep copy
        myOrders[event?.target?.name] = event?.target?.value;
        setOrders(myOrders);

    };

    let sendOrderDataToApi = async () => {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, orders, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((res) => {
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
            setIsLoading(false);
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
        });
    };
    let validateOrderForm = () => {
        const schema = Joi.object({
            user_id: Joi.number().required(),
            customer_code: Joi.string().alphanum().required().messages({
                'string.empty': 'كود العميل مطلوب',
                'any.required': 'كود العميل مطلوب',
                'string.alphanum':'كود العميل يجب أن يكون أرقام أو حروف، لا يحتوي على رموز'
            }),
            cost: Joi.string().required().messages({
                'string.empty': 'قيمة الأوردر مطلوبة',
                'any.required': 'قيمة الأوردر مطلوبة',
            }),
            total_ammount: Joi.string().required().messages({
                'string.empty': 'إجمالي المبلغ مطلوب',
                'any.required': 'إجمالي المبلغ مطلوب',
            }),
            sale_point_id: Joi.string().required().messages({
                'string.empty': 'نقطة البيع مطلوبة',
                'any.required': 'نقطة البيع مطلوبة',
            }),
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
            setIsLoading(false);
            try {
                validation?.error?.details?.map((err) => {
                    toast.error(err.message);
                })
            } catch (e) {
                toast.error("حدث خطأ ما");
            }
        }
    };
    let [salePoints, setSalePoints] = useState([]);
    let getSalePointsData = async () => {
        try {
            let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/points`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setSalePoints(data.data);
        } catch (error) {
            toast.error('حدث خطأ ما')
        }
    };
    useEffect(() => {
        getSalePointsData()
    }, []);

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
                        <div className="col-md-4">
                            <label htmlFor="user_id" className='form-label' >كود الموظف   </label>
                            <Select
                                name="user_id"
                                isClearable
                                options={userOptions}
                                // value={userOptions?.find((opt) => opt?.value === orders.user_id )} 
                                onChange={getSelectedUser}
                                isSearchable={true}
                                placeholder="إضافة موظف"
                            />

                        </div>
                        <div className="col-md-4">
                            <label htmlFor="customer_id" className='form-label'>كود العميل  </label>
                            <CreatableSelect
                                name="customer_code"
                                isClearable
                                options={clientOptions}
                                value={clientOptions?.find((opt) => opt?.value === orders?.customer_code)}
                                onChange={getSelectedClient}
                                isSearchable={true}
                                placeholder="بحث عن عميل..."

                            />
                        </div>
                        {/* <div className="col-md-4">
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
                        </div> */}
                        <div className="col-md-4">
                            <label htmlFor="sale_point_id" className='form-label'>نقطة البيع </label>
                            <select name="sale_point_id" defaultValue={0} className='form-control' id="sale_point_id"
                                onChange={getInputValue}>
                                <option value={0} hidden selected disabled>اختار</option>
                                {salePoints.map((point) => <option key={point.id} value={point.id}>{point.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="cost" className='form-label'>قيمة الأوردر </label>
                            <input type="text" className='form-control' name="cost" id="cost" onChange={getInputValue} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="totalAmmount" className='form-label'> إجمالي المبلغ مع الطيار </label>
                            <input type="text" className='form-control' name="total_ammount" id="totalAmmount" onChange={getInputValue} />
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
