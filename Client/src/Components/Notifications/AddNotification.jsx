

import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';



export default function AddNotification() {
    let { accessToken } = useContext(AuthContext);

    const formRef = useRef(null);
    let [isLoading, setIsLoading] = useState(false);
    let [notifications, setNotification] = useState({
        body: ''
    });
    //get the values of input and put them in the notifications state
    let getInputValue = (event) => {
        let myNotifications = { ...notifications }; //deep copy
        myNotifications[event.target.name] = event.target.value;
        setNotification(myNotifications);
    };
    let sendNotificationDataToApi = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/notifications`, notifications, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }).then((res) => {
                formRef.current.reset();
                toast.success(res.data.message, {
                    position: 'top-center'
                });
                setIsLoading(false);
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

    let validateNotificationForm = () => {
        const schema = Joi.object({
            body: Joi.string().required(),
        });
        return schema.validate(notifications, { abortEarly: false });
    };
    let submitNotificationForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let validation = validateNotificationForm();
        if (!validation.error) {
            sendNotificationDataToApi();
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
                <title>Add Offer</title>
            </Helmet>
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة إشعار </h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form ref={formRef} onSubmit={submitNotificationForm} >
                    <div className="row gy-3">
                    <div className="col-md-12">
                            <label htmlFor="body" className='form-label'>إشعار</label>
                            <textarea className='form-control' name="body"
                                onChange={getInputValue} />
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
