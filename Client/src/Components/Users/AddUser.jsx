import axios from 'axios';
import Joi from 'joi';
import React, {useEffect, useState} from 'react'
import {json, NavLink, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';


export default function AddUser() {
    let navigate = useNavigate();

    let [isLoading, setIsLoading] = useState(false);
    let [users, setUsers] = useState({
        name: '',
        role: '',
        phone: '',
        password: '',
        password_confirmation: '',
        salary: '',
        code: '',
        hourRate: '',
        notes: '',
    });
    let getInputValue = (event) => {
        let myUsers = {...users}; //deep copy
        myUsers[event.target.name] = event.target.value;
        setUsers(myUsers);
    }
    let sendUserDataToApi = async () => {

            await axios.post(`http://127.0.0.1:8000/api/users`, users).then((res) => {
                toast.success(res.data.message);
                setIsLoading(false);
                navigate('../users');

            }).catch((errors) => {
                setIsLoading(false);
                const errorList = errors?.response?.data?.error;
                if (errorList !== undefined) {
                    Object.keys(errorList).map((err) => {
                        errorList[err].map((err) => {
                            toast.error(err);
                        })
                    });
                }else {
                    toast.error("حدث خطأ ما");
                }
            });




    }

    let validateUserFrom = () => {
        const schema = Joi.object({
            name: Joi.string().min(3).max(20).required(),
            code: Joi.string().required(),
            role: Joi.string().required(),
            phone: Joi.string().required().pattern(/^01[0125][0-9]{8}$/).message('رقم الهاتف غير صالح'),
            password: Joi.string().required(),
            password_confirmation: Joi.ref('password'),
            hourRate: Joi.number().required(),
            salary: Joi.number().empty(''),
            notes: Joi.string().empty(''),

        });
        return schema.validate(users, {abortEarly: false});

    }
    let SubmitUserForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let validation = validateUserFrom();
        if (!validation.error) {
            sendUserDataToApi();
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
    }

    return (
        <>
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة عميل جديد</h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form onSubmit={SubmitUserForm}>
                    <div className="row gy-3">
                        <div className="col-md-4">
                            <label htmlFor="code" className='form-label'>كود العميل</label>
                            <input type="text" className='form-control' name="code" id="code" onChange={getInputValue}/>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="name" className='form-label'>الاسم</label>
                            <input type="text" className='form-control' name="name" id="name" onChange={getInputValue}/>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="role" className='form-label'>الوظيفة</label>
                            <select name="role" defaultValue={0} className='form-control' id="role"
                                    onChange={getInputValue}>
                                <option value={0} hidden disabled>اختار</option>
                                <option value="مشرف">مشرف</option>
                                <option value="صيدلي">صيدلي</option>
                                <option value="طيار">طيار</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="phone" className='form-label'>رقم الهاتف</label>
                            <input type="tel" className='form-control' name="phone" id="phone"
                                   onChange={getInputValue}/>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="hourRate" className='form-label'>سعر الساعة </label>
                            <input type="number" className='form-control' name="hourRate" id="hourRate"
                                   onChange={getInputValue}/>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="salary" className='form-label'>الراتب</label>
                            <input type="number" className='form-control' name="salary" id="salary"
                                   onChange={getInputValue}/>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="password" className='form-label'>كلمة السر</label>
                            <input type="password" className='form-control' name="password" id="password"
                                   onChange={getInputValue}/>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="password_confirmation" className='form-label'>تأكيد كلمة السر</label>
                            <input type="password" className='form-control' name="password_confirmation"
                                   id="password_confirmation" onChange={getInputValue}/>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="notes" className='form-label'>ملاحظات</label>
                            <textarea name="notes" id="notes" className='form-control' onChange={getInputValue}/>
                        </div>
                        <div className="col-md-3">
                            <button type='submit' className='btn btn-primary form-control fs-5'>
                                {isLoading == true ? <i className='fa fa-spinner fa-spin'></i> : 'إضافة'}
                            </button>
                        </div>
                        <div className="col-md-3">
                            <NavLink to='../users' className='btn  btn-secondary form-control fs-5'>رجوع</NavLink>

                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
