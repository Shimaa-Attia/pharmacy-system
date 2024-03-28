

import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { AuthContext } from '../../Context/AuthStore';
import Pagination from '../Pagination/Pagination';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import Joi from 'joi';


export default function DeliveryPopUpOrders() {
    let { accessToken } = useContext(AuthContext);
    let formRef = useRef(null)
    let [pagination, setPagination] = useState(null);
    let [currentPage, setCurrentPage] = useState(1); // Current page state
    let [orders, setOrders] = useState([]);
    let getOrderData = async (page = 1) => {
        let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/unAcceptedOrders?page=${page}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        setOrders(data.data);
        setPagination(data.meta); // Set pagination data
        setCurrentPage(page); // Set current page

    }
    useEffect(() => { getOrderData() }, []);
    //for handle page change
    let handlePageChange = (page) => {
        getOrderData(page);
    };
    
    let [costValue, setCostValue] = useState({
        cost: ''
    });
    let getInputValue = (event) => {
        setCostValue(prevValue => ({
            ...prevValue,
            cost: event.target.value
        }));
    };
    let sendCostValueToApi = async (orderId) => {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/orders/acceptPopUpOrder/${orderId}`, costValue, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((res) => {
            toast.success(res.data.message);
            setCostValue({
                cost:''
            })
            formRef.current.reset();
            getOrderData()
        }).catch((errors) => {
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
                toast.error('حدث خطأ ما')
            }
        });
        
    }
    let validateCostValue = () => {
        const schema = Joi.object({
            cost: Joi.string().required().messages({
                'string.empty': 'قيمة الأوردر مطلوبة',
                'any.required': 'قيمة الأوردر مطلوبة',
            }),
        });
        return schema.validate(costValue, { abortEarly: false });
    };
    let submitAcceptOrderForm = (e) => {
        e.preventDefault();
        let validation = validateCostValue();
        if (!validation.error) {
            sendCostValueToApi(orderId);
        } else {
            try {
                validation?.error?.details?.map((err) => {
                    toast.error(err.message);
                })
            } catch (e) {
                toast.error("حدث خطأ ما");
            }
        }
    };
    let [orderId, setOrderId] = useState('');
    let showOrders = () => {
        if (orders.length > 0) {
            return (
                <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive">
                    <table dir="rtl" className='table  table-hover text-center align-middle table-responsive-list '>
                        <thead className='table-primary  no-wrap-heading'>
                            <tr>
                                <th> تاريخ الإنشاء</th>
                                <th>كود العميل</th>
                                <th> نقطة اليبع</th>
                                <th>المنطقة </th>
                                <th>خيارات </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => <tr key={order.id}>
                                <td data-label="تاريخ الإنشاء"  >{order.created_at}</td>
                                <td data-label="كود العميل">{order?.customer?.code}</td>
                                <td data-label="نقطة البيع">{order?.sale_point?.name}</td>
                                <td data-label="المنطقة">{order?.area?.name}</td>
                                <td data-label="خيارات">
                                    <button onClick={() => { setOrderId(order.id) }} type="button" className="btn  btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        قبول
                                    </button>
                                </td>
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
                </div>
            )
        }
    };

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Orders</title>
            </Helmet>
            <div>
                <p className='alert alert-danger m-3 text-center fw-bold fs-4' >الأوردرات المعلقة</p>
            </div>
            {/* cost modal  */}

            <div dir='rtl' className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title text-danger fs-5" id="exampleModalLabel"> يجب إدخال تكلفة الأوردر</h1>
                        </div>
                        <div className="modal-body">
                            <form ref={formRef} onSubmit={submitAcceptOrderForm}>
                                <div className="">
                                    <label htmlFor="cost" className='form-label'>قيمة الأوردر </label>
                                    <input type="number" className='form-control' name="cost" id="cost" onChange={getInputValue} />
                                </div>
                                <div className="my-2">
                                    <button type="button" className="btn btn-secondary ms-3" data-bs-dismiss="modal">غلق</button>
                                    <button type="submit" className="btn btn-primary">تأكيد </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>

            <div className="text-center my-2">
                <Pagination pagination={pagination} currentPage={currentPage} handlePageChange={handlePageChange} />
            </div>
            {showOrders()}
        </>
    )
}
