import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';

export default function EditeCompany() {
    let { accessToken } = useContext(AuthContext);
    let navigate = useNavigate()
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
    //getting data for one company 
    let { id } = useParams()
    let [onecompany, setOnecompany] = useState([]);
    let getCompany = async () => {
        try {
            let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies/show/${id}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setOnecompany(data);
            setCompanies({
                name: data?.name,
                phoneNumber: data?.phoneNumber,
                entryInstructions: data?.entryInstructions,
                TaxCard: data?.TaxCard,
                notes: data?.notes
            })

        } catch (error) {
            toast.error('حدث خطأ ما، حاول مرة أخرى')
        }

    };
    useEffect(() => { getCompany() }, []);

    let sendEditedCompaniesDataToApi = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/companies/${id}`, companies, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }).then((res) => {
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

    let validateEditedCompaniesForm = () => {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                'string.empty': 'اسم الشركة  مطلوب',
                'any.required': 'اسم الشركة  مطلوب',
            }),
            phoneNumber: Joi.any().empty(''),
            entryInstructions: Joi.any().empty(''),
            TaxCard: Joi.any().empty(''),
            notes: Joi.any().empty(''),
        });
        return schema.validate(companies, { abortEarly: false });
    };
    let submitEditedCompaniesForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let validation = validateEditedCompaniesForm();
        if (!validation.error) {
            sendEditedCompaniesDataToApi();
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
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>تعديل شركة </h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form onSubmit={submitEditedCompaniesForm} >
                    <div className="row gy-3">
                        <div className="col-md-4">
                            <label htmlFor="name" className='form-label'>اسم الشركة </label>
                            <input type="text" className='form-control' name="name"
                                defaultValue={onecompany?.name}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="TaxCard" className='form-label'>البطاقة الضريبية</label>
                            <input type="text" className='form-control' name="TaxCard"
                                defaultValue={onecompany?.TaxCard}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="phoneNumber" className='form-label'>رقم الهاتف</label>
                            <input type="text" className='form-control' name="phoneNumber"
                                defaultValue={onecompany?.phoneNumber}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="entryInstructions" className='form-label'>تعليمات الإدخال</label>
                            <textarea name="entryInstructions" className='form-control'
                                defaultValue={onecompany?.entryInstructions}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="notes" className='form-label'>ملاحظات</label>
                            <textarea name="notes" className='form-control'
                                defaultValue={onecompany?.notes}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-3">
                            <button type='submit' className='btn btn-primary form-control fs-5'>
                                {isLoading == true ? <i className='fa fa-spinner fa-spin'></i> : 'تعديل'}
                            </button>
                        </div>
                       
                    </div>
                </form >
            </div >
        </>
    )
}
