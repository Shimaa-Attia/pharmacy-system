import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

export default function AddOrderDoctor() {
    let { accessToken } = useContext(AuthContext);
    const formRef = useRef(null);
    const clientSelectRef = useRef(null);
    let [isLoading, setIsLoading] = useState(false);
    let [clients, setClients] = useState([]);
    let [orders, setOrders] = useState({
        customer_code: '',
        cost: '',
        notes: '',
        sale_point_id: '',
        area_id:''
    });

    let [clientOptions, setClientOptions] = useState([]);
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

    useEffect(() => {
        try {
            let mapClient = clients?.map((client) => ({
                value: `${client.code}`,
                label: `${client.code}`,
                onHim: `${client.onHim}`,
                forHim: `${client.forHim}`,
                notes: `${client.notes}`,
                customer_area: `${client.areas.map(area => area.name)}`,
                defaultArea:`${client?.defaultArea?.name}`
            }));
            setClientOptions(mapClient);
        } catch (error) {
            toast.error('حدث خطأ ما')
        }
    }, [clients]);
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
       //making map on the areas data to display the name in the option
       let [areasOptions, setAreasOptions] = useState([])
       useEffect(() => {
           let mapAreas = areasData?.map((area) => ({
               value: `${area.id}`,
               label: `${area.name}`
           }));
           setAreasOptions(mapAreas);
       }, [areasData]);
    let [customerData, setCustomerData] = useState([]);
    let getSelectedClient = (selectedOption) => {
        setOrders({
            ...orders,
            customer_code: selectedOption?.value,
        });
        setCustomerData(selectedOption)
    };
    let getSelectedArea = (selectedOption) => {
        setOrders({
            ...orders,
            area_id: selectedOption?.value,
        });
    };
   //for dispaly  onhim , forhim
   let [customerCodeChanged, setCustomerCodeChanged] = useState(false);
   useEffect(() => {
       if (orders.customer_code !== '') {
           setCustomerCodeChanged(true);
       } else {
           setCustomerCodeChanged(false);
       }
   }, [orders.customer_code]);
   
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
            setOrders({
                customer_code: '',
                cost: '',
                notes: '',
                sale_point_id: '',
                area_id:''
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
    };
    let validateOrderForm = () => {
        const schema = Joi.object({
            customer_code: Joi.string().required().messages({
                'string.empty': 'كود العميل مطلوب',
                'any.required': 'كود العميل مطلوب',
            }),
            cost: Joi.string().required().messages({
                'string.empty': 'قيمة الأوردر مطلوبة',
                'any.required': 'قيمة الأوردر مطلوبة',
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
                            {customerData ? (
                                <>
                                    <div className='bg-danger-subtle p-2 rounded'>
                                    <div> المنطقة الإفتراضية: {customerData?.defaultArea ? customerData?.defaultArea : 'لا يوجد'}</div>
                                    <div>المناطق الأخرى: {customerData?.customer_area ? customerData?.customer_area : 'لا يوجد'}</div>
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
                                <option value={0} hidden  disabled>اختر...</option>
                                {salePoints.map((point) => <option key={point.id} value={point.id}>{point.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="cost" className='form-label'>قيمة الأوردر </label>
                            <input type="text" className='form-control' name="cost" id="cost" onChange={getInputValue} />
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
