import React, { useContext } from 'react'
import axios from 'axios';
import Joi from 'joi';
import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {Field, Form, Formik} from "formik";
import { Helmet } from 'react-helmet';
import { AuthContext } from '../../Context/AuthStore';


export default function AddClient() {
    let { accessToken } = useContext(AuthContext);
 

    let [isLoading, setIsLoading] = useState(false);

    let initialValues = {
        code: '',
        name: '',
        phones: [],
        addresses: [],
        onHim:'',
        forHim:'',
        notes: ''
    }
    let [clientData, setClientData] = useState({ ...initialValues });

    let sendClientDataToApi = async (values) => {

        await axios.post(`${process.env.REACT_APP_API_URL}/api/customers`, values, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((res) => {
            toast.success(res.data.message, {
                position: 'top-center'
            });
            setIsLoading(false);
          setClientData({ ...initialValues });
        }).catch((errors) => {
            console.log(errors);
            setIsLoading(false);
            try {
                const errorList = errors?.response?.data?.message;
                if (errorList !== undefined) {
                    Object.keys(errorList).map((err) => {
                        errorList[err].map((err) => {
                            toast.error(err);
                        })
                    });
                }
            } catch (error) {
                toast.error('حدث خطأ ما')
            }
          
        });
    };
    let validateClientForm = (values) => {
        const schema = Joi.object({
            name: Joi.string().empty(''),
            code: Joi.string().required(),
            phones: Joi.any().empty(''),
            addresses: Joi.any().empty(''),
            onHim:Joi.number().empty(''),
            forHim:Joi.number().empty(''),
            notes: Joi.string().empty(''),

        });

        return schema.validate(values, { abortEarly: false });

    };
  
    let submitClientForm = (values) => {
        setIsLoading(true);
        let validation = validateClientForm(values);
        if (!validation.error) {
            sendClientDataToApi(values);
        
         
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
    let [showInput, setShowInput] = useState(false);
    let toggleInput = () => {
        setShowInput(!showInput);
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Add Client</title>
            </Helmet>
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة عميل جديد</h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">

                <Formik  initialValues={
                    clientData
                } onSubmit={(values, { resetForm  }) => {
                    submitClientForm(values );
                    
                   
                  
                }}>
                    {
                        formik => {
                            return (
                                <Form className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="code" className='form-label'>كود العميل</label>
                                        <Field  type="text" className='form-control' name="code" id="code" />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="name" className='form-label'>الاسم</label>
                                        <Field type="text" className='form-control' name="name" id="name" />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="phone1" className='form-label'> رقم هاتف</label>
                                        <Field type="text" id="phone1" className='form-control' name="phones[0]"   />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="addresses1" className='form-label'> عنوان</label>

                                        <Field type="text" id="addresses1" className='form-control' name="addresses[0]"  />
                                    </div>
                                    {showInput && <div className="col-md-6">
                                        <label htmlFor="phone2" className='form-label'> رقم هاتف آخر </label>
                                        <Field type="text" id="phone2" className='form-control' name="phones[1]" />
                                    </div>}
                                    {showInput && <div className="col-md-6">
                                        <label htmlFor="addresses2" className='form-label'> عنوان آخر</label>

                                        <Field type="text" id="addresses2" className='form-control' name="addresses[1]"  />
                                    </div>}
                                    <div className="col-md-12 ">
                                        <button type='button' className='btn btn-success' onClick={toggleInput} >
                                            {showInput === false ? 'إضافة المزيد' : 'إخفاء'}
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="onHim" className='form-label'>عليه</label>
                                        <Field type="text" className='form-control' name="onHim" id="name" />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="forHim" className='form-label'>له</label>
                                        <Field type="text" className='form-control' name="forHim" id="name" />
                                    </div>

                                    <div className="col-md-12">
                                        <label htmlFor="notes" className='form-label'>ملاحظات</label>
                                        <Field type="text" as="textarea" id="notes" className='form-control' name="notes" />
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
