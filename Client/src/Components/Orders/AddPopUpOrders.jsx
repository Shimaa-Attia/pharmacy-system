
import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

export default function AddPopUpOrders() {
    let { accessToken } = useContext(AuthContext);
    const clientSelectRef = useRef(null);
    const areaSelectRef = useRef(null)
    let [isLoading, setIsLoading] = useState(false);
    let [clients, setClients] = useState([]);
    let [orders, setOrders] = useState({
        customer_code: '',
        sale_point_id: '',
        area_id: ''
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
            toast.error('حدث خطأ ما.')
        }
    };

    useEffect(() => {
        getClientData()
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
        //making map on the areas data to display the name in the option
        let [areasOptions, setAreasOptions] = useState([])
        useEffect(() => {
            let mapAreas = areasData?.map((area) => ({
                value: `${area.id}`,
                label: `${area.name}`
            }));
            setAreasOptions(mapAreas);
        }, [areasData]);
    //for dispaly area, onhim , forhim
    let [customerCodeChanged, setCustomerCodeChanged] = useState(false);
    useEffect(() => {
        if (orders.customer_code !== '') {
            setCustomerCodeChanged(true);
        } else {
            setCustomerCodeChanged(false);
        }
    }, [orders.customer_code]);
    useEffect(() => {
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
    }, [clients]);

    let [customerData, setCustomerData] = useState([]);
    let getSelectedClient = (selectedOption) => {
        setOrders({
            ...orders,
            customer_code: selectedOption?.value,
        });
        setCustomerData(selectedOption);
    };
    let getSelectedArea = (selectedOption) => {
        setOrders({
            ...orders,
            area_id: selectedOption?.value,
        });
    };

    let getSalePointIdFromSessionStorage = () => {
      let salePointId = sessionStorage.getItem('salePoint');
        setOrders({
            ...orders,
            sale_point_id: salePointId,
        });
    };
    useEffect(()=>{
      getSalePointIdFromSessionStorage()
    },[])

    let sendOrderDataToApi = async () => {

        await axios.post(`${process.env.REACT_APP_API_URL}/api/orders/AddPopUpOrder`, orders, {
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
                sale_point_id: '',
                area_id: ''
            })  
            areaSelectRef.current.clearValue();
            clientSelectRef.current.clearValue();
        }).catch((errors) => {
       
            setIsLoading(false);
            try {
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
            } catch (error) {
              toast.error(errors.response.data.message);
            }

        });
    };
    let validateOrderForm = () => {
        const schema = Joi.object({
            customer_code: Joi.string().alphanum().required().messages({
                'string.empty': 'كود العميل مطلوب',
                'any.required': 'كود العميل مطلوب',
                'string.alphanum': 'كود العميل يجب أن يكون أرقام أو حروف، لا يحتوي على رموز'
            }),
            sale_point_id: Joi.string().required().messages({
                'string.empty': 'نقطة البيع مطلوبة',
                'any.required': 'نقطة البيع مطلوبة',
            }),
            area_id: Joi.number().empty(''),
            
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
                <form  onSubmit={submitOrderForm} >
                    <div className="row gy-3">
                    
                        <div className="col-md-4">
                            <label htmlFor="customer_code" className='form-label'>كود العميل  </label>
                            <CreatableSelect
                                name="customer_code"
                                ref={clientSelectRef}
                                isClearable
                                options={clientOptions}
                                value={clientOptions?.find((opt) => opt?.value === orders?.customer_code)}
                                onChange={getSelectedClient}
                                isSearchable={true}
                                placeholder="بحث عن عميل..."

                            />
                        </div>
                        {customerCodeChanged && <div className="col-md-6  ">
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
                                ref={areaSelectRef}
                                options={areasOptions}                                
                                onChange={getSelectedArea}
                                isSearchable={true}
                                placeholder="بحث عن منطقة..."

                            />
                        </div>
                    </div>
                        <div className="col-md-3 my-4">
                            <button type='submit' className='btn btn-primary form-control fs-5'>
                                {isLoading == true ? <i className='fa fa-spinner fa-spin'></i> : 'إضافة'}
                            </button>
                        </div>
                </form >
            </div >
        </>
    )
}
