
import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';



export default function AddOffer() {
    let { accessToken } = useContext(AuthContext);
    //selcting form inputs to reset the form after submtion
    const productNameInputRef = useRef(null);
    const offerInputRef = useRef(null);
    const offerEndDateInputRef = useRef(null);
    const notesInputRef = useRef(null);

    let [isLoading, setIsLoading] = useState(false);
    let [offers, setOffers] = useState({
        productName: '',
        offer: '',
        offer_endDate: '',
        notes: ''
    });
    //get the values of input and put them in the offers state
    let getInputValue = (event) => {
        let myOffers = { ...offers }; //deep copy
        myOffers[event.target.name] = event.target.value;
        setOffers(myOffers);
    };
    let sendOfferDataToApi = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/offers`, offers, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }).then((res) => {
                productNameInputRef.current.value = ''
                offerInputRef.current.value = ''
                offerEndDateInputRef.current.value = ''
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

    let validateOfferForm = () => {
        const schema = Joi.object({
            productName: Joi.string().required().messages({
                'string.empty': 'اسم المنتج  مطلوب',
                'any.required': 'اسم المنتج  مطلوب',
            }),
            offer: Joi.string().empty(''),
            offer_endDate: Joi.date().empty(''),
            notes: Joi.string().empty(''),
        });
        return schema.validate(offers, { abortEarly: false });
    };
    let submitOfferForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let validation = validateOfferForm();
        if (!validation.error) {
            sendOfferDataToApi();
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
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة عرض </h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form onSubmit={submitOfferForm} >
                    <div className="row gy-3">
                        <div className="col-md-4">
                            <label htmlFor="productName" className='form-label'>اسم المنتج </label>
                            <input type="text" className='form-control' name="productName"
                                ref={productNameInputRef}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="offer" className='form-label'>العرض</label>
                            <input type="text" className='form-control' name="offer"
                                ref={offerInputRef}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="offer_endDate" className='form-label'>تاريخ انتهاء العرض</label>
                            <input type="date" className='form-control' name="offer_endDate"
                                ref={offerEndDateInputRef}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="notes" className='form-label'>ملاحظات</label>
                            <textarea name="notes" id="notes" className='form-control'
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
