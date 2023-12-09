import React from 'react'
import axios from 'axios';
import Joi from 'joi';
import {useEffect, useState} from 'react'
import {NavLink, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

export default function AddClient() {
    let accessToken = localStorage.getItem('userToken');
    let navigate = useNavigate();
    let [isLoading, setIsLoading] = useState(false);
    let [clients, setClients] = useState({
        code: '',
        name: '',
        phones: [],
        addresses: [],
        notes: ''
    });
    let [phones, setPhones] = useState({
        phone1:"",
        phone2:"",
    });
    let getPhoneValue = (event) => {
        let myPhones = {...phones};

        setPhones({
            ...phones,
            [event.target.name]: event.target.value
        })

        console.log(phones)
    }

    let getInputValue = (event) => {
        let myClients = {...clients}; //deep copy


        myClients[event.target.name] = event.target.value

        console.log(phones)
        setClients(myClients);
    };
    let sendClientDataToApi = async () => {
        await axios.post(`http://pharma-erp.atomicsoft-eg.com/api/customers`, clients, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((res) => {
            console.log(res.data.message);
            toast.success(res.data.message, {
                position: 'top-center'
            });
            setIsLoading(false);

        }).catch((errors) => {
            console.log(errors);
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
                console.log('send to api');
            }
        });
    };
    // let validateClientForm = () => {
    //     const schema = Joi.object({
    //         name: Joi.string().min(3).max(20).required(),
    //         code: Joi.string().required(),
    //         phones: Joi.string().required().pattern(/^01[0125][0-9]{8}$/),
    //         addresses: Joi.string().min(5).max(50).required(),
    //         notes: Joi.string().empty(''),

    //     });
    //     return schema.validate(clients, { abortEarly: false });

    // }

    let submitClientForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
        // let validation = validateClientForm();
        // if (!validation.error) {
        //     sendClientDataToApi();
        // } else {
        //     setIsLoading(false);
        //     try {
        //         validation.error.details.map((err) => {
        //             toast.error(err.message);
        //         })
        //     } catch (e) {
        //         toast.error("حدث خطأ ما");
        //         console.log('validate from');
        //     }
        // }
    };
    return (
        <>
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة عميل جديد</h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form onSubmit={submitClientForm}>
                    <div className="row gy-3">
                        <div className="col-md-6">
                            <label htmlFor="code" className='form-label'>كود العميل</label>
                            <input type="text" className='form-control' name="code" id="code"
                                   onChange={getInputValue}/>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="name" className='form-label'>الاسم</label>
                            <input type="text" className='form-control' name="name" id="name"
                                   onChange={getInputValue}/>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="phone1" className='form-label'> رقم هاتف</label>
                            <input type="tel" className='form-control' name="phone1" id="phones"
                                   onChange={getPhoneValue}/>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="phone2" className='form-label'> رقم هاتف 2 </label>
                            <input type="tel" className='form-control' name="phone2" id="phones"
                                   onChange={getPhoneValue}/>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="addresses" className='form-label'> العنوان</label>
                            <input type="text" className='form-control' name="addresses" id="addresses"
                                   onChange={getInputValue}/>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="addresses" className='form-label'> العنوان</label>
                            <input type="text" className='form-control' name="addresses" id="addresses"
                                   onChange={getInputValue}/>
                        </div>

                        <div className="col-md-12">
                            <label htmlFor="notes" className='form-label'>ملاحظات</label>
                            <textarea name="notes" id="notes" className='form-control'
                                      onChange={getInputValue}/>
                        </div>
                        <div className="col-md-3">
                            <button type='submit' className='btn btn-primary form-control fs-5'>
                                {isLoading == true ? <i className='fa fa-spinner fa-spin'></i> : 'إضافة'}
                            </button>
                        </div>
                        <div className="col-md-3">
                            <NavLink to='../clients' className='btn  btn-secondary form-control fs-5'>رجوع</NavLink>
                        </div>
                    </div>
                </form>
            </div>

        </>
    )
}
