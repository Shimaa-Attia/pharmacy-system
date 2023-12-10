import React from 'react'
import axios from 'axios';
import Joi from 'joi';
import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddClient() {
    let formElemnts = document.querySelectorAll('form input');
    let formtextArea = document.querySelector('form textarea');
    let address = document.querySelectorAll('.address');
    let phone = document.querySelectorAll('.phone');
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

    let myClients = { ...clients };
    let getInputValue = (event) => {
        let myClients = { ...clients }; //deep copy
        myClients[event.target.name] = event.target.value;
        setClients(myClients);
    };

    let [phones, setPhones] = useState([]);
    // let getPhoneValue = (event) => {
    //     if (event.target.value.length == 11) {
    //         phones.push(event.target.value);
    //     };
    //     let myClients = { ...clients };
    //     myClients[event.target.name] = phones;
    //     setClients(myClients);
    //     // console.log(clients);
    // };
 

    let [addresses, setAddresses] = useState([]);
    // let getAddressValue = (event) => {
    //     // console.log(event.addresses);


    //     let myClients = { ...clients };
    //     myClients[event.target.name] = addresses;
    //     setClients(myClients);
    //     // console.log(clients);

    // }

    let addingDataToArray =(elements,arr)=>{
        elements.forEach(add => {
            arr.push(add.value);

        })
    }
    

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
            const errorList = errors?.response?.data?.msg;
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
    let validateClientForm = () => {
        const schema = Joi.object({
            name: Joi.string().min(3).max(20).required(),
            code: Joi.string().required(),
            // phones: Joi.array().items(Joi.number()).required().pattern(/^01[0125][0-9]{8}$/),
            // addresses: Joi.array().items(Joi.string()).min(5).required(),
            phones:Joi.required(),
            addresses:Joi.required(),
            notes: Joi.string().empty(''),

        });
        return schema.validate(clients, { abortEarly: false });

    }


    let submitClientForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let validation = validateClientForm();
        if (!validation.error) {
            window.setTimeout(() => {
                addingDataToArray(address,addresses);
                myClients.addresses = addresses;
                addingDataToArray(phone,phones)
                    myClients.phones = phones;
                    setClients(myClients);
                    
                console.log(myClients);
                sendClientDataToApi(); 
                formElemnts.forEach((elm)=>{
                    elm.value ='';
                })
                formtextArea.value = ''   
            }, 0)
           
        } else {
            setIsLoading(false);
            try {
                validation.error.details.map((err) => {
                    toast.error(err.message);
                })
            } catch (e) {
                toast.error("حدث خطأ ما");
                console.log('validate from');
            }
        }
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
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="name" className='form-label'>الاسم</label>
                            <input type="text" className='form-control' name="name" id="name"
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="phone1" className='form-label'> رقم هاتف</label>
                            <input type="tel" className='form-control phone' name="phones" id="phone1"
                                 />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="phone2" className='form-label'> رقم هاتف 2 </label>
                            <input type="tel" className='form-control phone ' name="phones" id="phone2"
                                />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="addresses1" className='form-label'> العنوان</label>
                            <input type="text" className='form-control address' name="addresses" id="addresses1"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="addresses2" className='form-label'> 2العنوان</label>
                            <input type="text" className='form-control address' name="addresses" id="addresses2"
                            />
                        </div>

                        <div className="col-md-12">
                            <label htmlFor="notes" className='form-label'>ملاحظات</label>
                            <textarea name="notes" id="notes" className='form-control'
                                onChange={getInputValue} />
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
