

import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';

export default function AddCompany() {
    let { accessToken } = useContext(AuthContext);
    //selcting form inputs to reset the form after submtion
    const nameInputRef = useRef(null);
    const phoneNumberInputRef = useRef(null);
    const entryInstructionsInputRef = useRef(null);
    const TaxCardInputRef = useRef(null);
    const notesInputRef = useRef(null);

    let [isLoading, setIsLoading] = useState(false);
    let [companies, setCompanies] = useState({
        name: '',
        phoneNumber: '',
        entryInstructions: '',
        TaxCard: '',
        notes: ''
    });
    //get the values of input and put them in the offers state
    let getInputValue = (event) => {
        let mycompanies = { ...companies }; //deep copy
        mycompanies[event.target.name] = event.target.value;
        setCompanies(mycompanies);
    };
    let sendCompaniesDataToApi = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/companies`, companies, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }).then((res) => {
                nameInputRef.current.value = ''
                TaxCardInputRef.current.value = ''
                entryInstructionsInputRef.current.value = ''
                phoneNumberInputRef.current.value = ''
                notesInputRef.current.value = ''
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

    let validateCompaniesForm = () => {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                'string.empty': 'اسم الشركة  مطلوب',
                'any.required': 'اسم الشركة  مطلوب',
            }),
            phoneNumber: Joi.string().empty('').pattern(/^01[0125][0-9]{8}$/).message('رقم الهاتف غير صالح'),
            entryInstructions: Joi.string().empty(''),
            TaxCard: Joi.string().empty(''),
            notes: Joi.string().empty(''),
        });
        return schema.validate(companies, { abortEarly: false });
    };
    let submitCompaniesForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let validation = validateCompaniesForm();
        if (!validation.error) {
            sendCompaniesDataToApi();
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
                <title>Add Company</title>
            </Helmet>
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة شركة </h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form onSubmit={submitCompaniesForm} >
                    <div className="row gy-3">
                        <div className="col-md-4">
                            <label htmlFor="name" className='form-label'>اسم الشركة </label>
                            <input type="text" className='form-control' name="name"
                                ref={nameInputRef}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="TaxCard" className='form-label'>البطاقة الضريبية</label>
                            <input type="text" className='form-control' name="TaxCard"
                                ref={TaxCardInputRef}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="phoneNumber" className='form-label'>رقم الهاتف</label>
                            <input type="text" className='form-control' name="phoneNumber"
                                ref={phoneNumberInputRef}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="entryInstructions" className='form-label'>تعليمات الإدخال</label>
                            <textarea name="entryInstructions" className='form-control'
                                ref={entryInstructionsInputRef}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="notes" className='form-label'>ملاحظات</label>
                            <textarea name="notes" className='form-control'
                                ref={notesInputRef}
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
