import React from 'react'
import axios from 'axios';
import Joi from 'joi';
import {useEffect, useState} from 'react'
import {NavLink, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Form, Formik} from "formik";

export default function AddClient() {
    let accessToken = localStorage.getItem('userToken');
    let [isLoading, setIsLoading] = useState(false);

    let  initialValues = {
        code: '',
        name: '',
        phones: [],
        addresses: [],
        notes: ''
    }
    let [clientData, setClientData] = useState( {...initialValues});

    let sendClientDataToApi = async (values) => {

        await axios.post(`http://pharma-erp.atomicsoft-eg.com/api/customers`, values, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((res) => {
          
            toast.success(res.data.message, {
                position: 'top-center'
            });
            setIsLoading(false);


        }).catch((errors) => {
            console.log(errors);
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
    let validateClientForm = (values) => {
        const schema = Joi.object({
            name: Joi.string().min(3).required(),
            code: Joi.string().required(),
            phones: Joi.required(),
            addresses: Joi.required(),
            notes: Joi.string().empty(''),

        });

        return schema.validate(values, {abortEarly: false});

    };

    let submitClientForm = (values) => {
        setIsLoading(true);
        let validation = validateClientForm(values);
        if (!validation.error) {
            sendClientDataToApi(values).finally(()=>{
                values= {
                    code: '',
                    name: '',
                    phones: [],
                    addresses: [],
                    notes: ''
                }
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

        setIsLoading(false);
    };


    return (
        <>
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة عميل جديد</h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">

                <Formik initialValues={
                    clientData
                } onSubmit={(values, actions) => {
                    submitClientForm(values)

                }}>
                    {
                        formik => {
                            return (
                                <Form className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="code" className='form-label'>كود العميل</label>
                                        <input type="text" className='form-control' name="code" id="code"
                                               onChange={formik.handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="name" className='form-label'>الاسم</label>
                                        <input type="text" className='form-control' name="name" id="name"
                                               onChange={formik.handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="phone1" className='form-label'> رقم هاتف</label>
                                        <input type="tel" className='form-control phone' name="phones[0]"
                                               id="phone1"
                                               onChange={formik.handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="phone2" className='form-label'> رقم هاتف 2 </label>
                                        <input type="tel" className='form-control phone ' name="phones[1]"
                                               id="phone2"
                                               onChange={formik.handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="addresses1" className='form-label'> العنوان</label>
                                        <input type="text" className='form-control address' name="addresses[0]"
                                               onChange={formik.handleChange}
                                               id="addresses1"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="addresses2" className='form-label'> 2العنوان</label>
                                        <input type="text" className='form-control address' name="addresses[1]"
                                               onChange={formik.handleChange}
                                               id="addresses2"
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <label htmlFor="notes" className='form-label'>ملاحظات</label>
                                        <textarea name="notes" id="notes" className='form-control'
                                        
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <button type='submit' className='btn btn-primary form-control fs-5'>
                                            {isLoading == true ?
                                                <i className='fa fa-spinner fa-spin'></i> : 'إضافة'}
                                        </button>
                                    </div>
                                    <div className="col-md-3">
                                        <NavLink to='../clients'
                                                 className='btn  btn-secondary form-control fs-5'>رجوع</NavLink>
                                    </div>
                                </Form>
                            )
                        }
                    }
                </Formik>

            </div>
        </>
    )
}
