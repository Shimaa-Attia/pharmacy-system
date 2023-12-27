import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';
import CreatableSelect from 'react-select/creatable';


export default function AddOrderDelivery() {
    let { accessToken } = useContext(AuthContext);
    const selectRef = useRef();

    let formInputs = document.querySelectorAll('form input');
    let formSelects = document.querySelectorAll('form select');
    let textarea = document.querySelector('form textarea');
    let [isLoading, setIsLoading] = useState(false);
    let [clients, setClients] = useState([]);
    let [users, setUsers] = useState([]);
    let [orders, setOrders] = useState({
        // customer_address: '',
        // customer_phone: '',
        customer_code: '',
        total_ammount: '',
        cost: '',
        notes: '',
        sale_point_id: ''
    });

    let [clientOptions, setClientOptions] = useState([]);
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
    useEffect(() => {
        let mapClient = clients?.map((client) => ({
            value: `${client.code}`,
            label: `${client.code}`
        }));
        setClientOptions(mapClient);
    }, [clients]);

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
    let getSelectedClient = (selectedOption) => {
        console.log(selectedOption)
        setOrders({
            ...orders,
            customer_code: selectedOption?.value,
        });
    };

    let [contacts, setContacts] = useState([]);
    useEffect(() => {
        if (orders.customer_code === '') {
            return;
        } else {
            getContactValue(orders.customer_code)
        }

    }, [orders.customer_code]);

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
            // customer_address: Joi.string().required(),
            // customer_phone: Joi.string().required(),
            customer_code: Joi.string().required(),
            total_ammount: Joi.string().required(),
            cost: Joi.string().required(),
            notes: Joi.string().empty(''),
            sale_point_id: Joi.string().required(),
        });
        return schema.validate(orders, { abortEarly: false });
    };
    //the key for making render for reset the form بصي على الفانكشن ال بتبعت الداتا للapi عشان نشيل الكي)
    const [key, setKey] = useState(0);
    let submitOrderForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let validation = validateOrderForm();
        if (!validation.error) {
            sendOrderDataToApi();
            setKey(key + 1);
            setClientOptions(null);

        } else {

            setIsLoading(false);
            try {
                console.log('validate error');
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
                <title>Add Order</title>
            </Helmet>
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة أوردر </h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form onSubmit={submitOrderForm} >
                    <div className="row gy-3">

                        <div className="col-md-4">
                            <label htmlFor="customer_code" className='form-label'>كود العميل  </label>
                            <CreatableSelect
                                name="customer_code"
                                isClearable
                                options={clientOptions}
                                value={clientOptions?.find((opt) => opt?.value === orders?.customer_code)}
                                onChange={getSelectedClient}
                                isSearchable={true}
                                placeholder="بحث عن عميل..."
                                key={key}
                            />
                        </div>

                        <div className="col-md-4">
                            <label htmlFor="sale_point_id" className='form-label'>نقطة البيع </label>
                            <select name="sale_point_id" defaultValue={0} className='form-control' id="sale_point_id"
                                onChange={getInputValue}>
                                     <option value={0} hidden selected disabled>اختار</option>
                                  {salePoints.map((point)=> <option key={point.id} value={point.id}>{point.name}</option>)} 
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
                            <NavLink to={`/deliverylayout/deliveryOrders/${users.id}`} className='btn  btn-secondary form-control fs-5'>رجوع</NavLink>

                        </div>
                    </div>
                </form >
            </div >
        </>
    )
}
