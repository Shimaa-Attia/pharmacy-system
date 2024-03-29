import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

export default function AddOrderDelivery() {
    let { accessToken } = useContext(AuthContext);
    //selcting form inputs and selects to reset the form after submtion
    const formRef = useRef(null);
    const clientSelectRef = useRef(null);
    let [isLoading, setIsLoading] = useState(false);
    let [clients, setClients] = useState([]);
    let [users, setUsers] = useState([]);
    let [clientOptions, setClientOptions] = useState([]);
    let [orders, setOrders] = useState({
        customer_code: '',
        total_ammount: '',
        // cost: '',
        notes: '',
        sale_point_id: '',
        area_id: ''
    });
    //get client data to put it in slecte options
    let getClientData = async () => {
        try {
            let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers?noPaginate=1`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setClients([...data.data]);
        } catch (error) {
            toast.error('حدث خطأ ما')
        }
    };
    useEffect(() => {
        getClientData()
    }, []);
    //define specific data to show in slecte options and wait until clients come [clients]
    useEffect(() => {
        let mapClient = clients?.map((client) => ({
            value: `${client.code}`,
            label: `${client.code}`,
            onHim: `${client.onHim}`,
            forHim: `${client.forHim}`,
            notes: `${client.notes}`,
            customer_area: `${client.areas.map(area => area.name)}`
        }));
        setClientOptions(mapClient);
    }, [clients]);
    //get the data of the selected clients to display on and for him
    let [customerData, setCustomerData] = useState([]);
    // get the value of selcted option in  the react select and put it in the orders

    let getSelectedClient = (selectedOption) => {
        setOrders({
            ...orders,
            customer_code: selectedOption?.value
        });
        setCustomerData(selectedOption)
    };
    //for dispaly  onhim , forhim , area , notes >> client data
    let [customerCodeChanged, setCustomerCodeChanged] = useState(false);
    useEffect(() => {
        if (orders.customer_code !== '') {
            setCustomerCodeChanged(true);
        } else {
            setCustomerCodeChanged(false);
        }
    }, [orders.customer_code]);
    //get users data to find the id of user to use it in the path to go back
    let getUserData = async () => {
        try {
            let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/auth`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setUsers(data);
        } catch (error) {
            toast.error('حدث خطأ ما')
        }
    };
    useEffect(() => {
        getUserData()
    }, []);
    //getting areas data to display in select 
    let [areasData, setAreasData] = useState([]);
    let getAreasData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/areas`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setAreasData(data);
        } catch (error) {
            toast.error('حدث خطأ أثناء جلب البيانات');
        }
    }
    useEffect(() => {
        getAreasData();
    }, []);
    let getSelectedArea = (selectedOption) => {
        setOrders({
            ...orders,
            area_id: selectedOption?.value,
        });
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
      //making map on the areas data to display the name in the option
      let [areasOptions, setAreasOptions] = useState([])
      useEffect(() => {
          let mapAreas = areasData?.map((area) => ({
              value: `${area.id}`,
              label: `${area.name}`
          }));
          setAreasOptions(mapAreas);
      }, [areasData]);

    //get the values of input and put them in the orders state
    let getInputValue = (event) => {
        let myOrders = { ...orders }; //deep copy
        myOrders[event.target.name] = event.target.value;
        setOrders(myOrders);
    };
    let sendOrderDataToApi = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, orders, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }).then((res) => {
                toast.success(res.data.message, {
                    position: 'top-center'
                });
                setIsLoading(false);
                setOrders({
                    customer_code: '',
                    total_ammount: '',
                    // cost: '',
                    notes: '',
                    sale_point_id: '',
                    area_id: '',
                })
                formRef.current.reset();
                clientSelectRef.current.clearValue();
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
        } catch (error) {
            toast.error("حدث خطأ ما");
        }
    };

    let validateOrderForm = () => {
        const schema = Joi.object({
            customer_code: Joi.string().required().messages({
                'string.empty': 'كود العميل مطلوب',
                'any.required': 'كود العميل مطلوب',
            }),
            // cost: Joi.string().required().messages({
            //     'string.empty': 'قيمة الأوردر مطلوبة',
            //     'any.required': 'قيمة الأوردر مطلوبة',
            // }),
            total_ammount: Joi.string().required().messages({
                'string.empty': 'إجمالي المبلغ مطلوب',
                'any.required': 'إجمالي المبلغ مطلوب',
            }),
            sale_point_id: Joi.string().required().messages({
                'string.empty': 'نقطة البيع مطلوبة',
                'any.required': 'نقطة البيع مطلوبة',
            }),
            area_id: Joi.number().empty(''),
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
 

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Add Order</title>
            </Helmet>
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة أوردر </h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form ref={formRef} onSubmit={submitOrderForm} >
                    <div className="row gy-3">

                        <div className="col-md-4">
                            <label htmlFor="customer_code" className='form-label'>كود العميل  </label>
                            <CreatableSelect
                                ref={clientSelectRef}
                                name="customer_code"
                                isClearable
                                options={clientOptions}
                                value={clientOptions?.find((opt) => opt?.value === orders?.customer_code)}
                                onChange={getSelectedClient}
                                isSearchable={true}
                                placeholder="بحث عن عميل..."
                            />
                        </div>

                        {customerCodeChanged && <div className="col-md-4  ">
                            {customerData?.onHim ? (
                                <>
                                    <div className='bg-danger-subtle p-2 rounded'>

                                        <div>المنطقة: {customerData?.customer_area  ? customerData?.customer_area : 'لا يوجد'}</div>
                                        <div>عليه: {customerData?.onHim !== 'null' ? customerData?.onHim : 'لا يوجد'}</div>
                                        <div>له: {customerData?.forHim !== 'null' ? customerData?.forHim : 'لا يوجد'}</div>
                                        <div>ملاحظة: {customerData?.notes !== 'null' ? customerData?.notes : 'لا يوجد'}</div>
                                    </div>
                                </>
                            ) : (
                                ''
                            )}
                        </div>}
                        <div className='col-md-4'>
                            <label htmlFor="areas" className='form-label'>المنطقة</label>
                            <Select
                                name="areas"
                                options={areasOptions}                                
                                onChange={getSelectedArea}
                                isSearchable={true}
                                placeholder="بحث عن منطقة..."

                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="sale_point_id" className='form-label'>نقطة البيع </label>
                            <select name="sale_point_id" defaultValue={0} className='form-control' id="sale_point_id"
                                onChange={getInputValue}>
                                <option value={0} hidden disabled>اختر...</option>
                                {salePoints.map((point) => <option key={point.id} value={point.id}>{point.name}</option>)}
                            </select>
                        </div>
                        {/* <div className="col-md-4">
                            <label htmlFor="cost" className='form-label'>قيمة الأوردر </label>
                            <input type="text" className='form-control' name="cost" id="cost" onChange={getInputValue} />
                        </div> */}
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

                    </div>
                </form >
            </div >
        </>
    )
}
