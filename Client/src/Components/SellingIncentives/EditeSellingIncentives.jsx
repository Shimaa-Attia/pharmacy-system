

import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';
import { useParams } from 'react-router-dom';



export default function EditeSellingIncentives() {
    let { accessToken } = useContext(AuthContext);
    //selcting form  to reset the form after submtion
    const formRef = useRef(null);
    let { id } = useParams()

    let [isLoading, setIsLoading] = useState(false);
    let [sellingIncentives, setSellingIncentives] = useState({
        productName: '',
        usage: '',
        composition: '',
        incentiveReason_id: '',
        incentivesPercentatge: '',
        notes: ''
    });
    //get the values of input and put them in the sellingIncentives state
    let getInputValue = (event) => {
        let mySellingIncentives = { ...sellingIncentives }; //deep copy
        mySellingIncentives[event.target.name] = event.target.value;
        setSellingIncentives(mySellingIncentives);
    };
    //getting data for one incentive
    let [oneIncentive, setOneIncentive] = useState([]);
    let getoneIncentive = async () => {
        try {
            let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/incentives/show/${id}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setOneIncentive(data.data);
            setSellingIncentives({
                productName: data?.data?.productName,
                usage: data?.data?.usage,
                composition: data?.data?.composition,
                incentiveReason_id: data?.data?.incentiveReason_id,
                incentivesPercentatge: data?.data?.incentivesPercentatge,
                notes: data?.data?.notes

            })
        } catch (error) {
            toast.error('حدث خطأ ما، حاول مرة أخرى')
        }

    };
    useEffect(() => { getoneIncentive() }, []);
    let sendEditedSellingIncentivesDataToApi = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/incentives/${id}`, sellingIncentives, {
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

    let validateEditedSellingIncentivesForm = () => {
        const schema = Joi.object({
            productName: Joi.string().required().messages({
                'string.empty': 'اسم المنتج  مطلوب',
                'any.required': 'اسم المنتج  مطلوب',
            }),
            usage: Joi.string().empty(null),
            composition: Joi.string().empty(null),
            incentiveReason_id: Joi.number().empty(null),
            incentivesPercentatge: Joi.number().empty(null),
            notes: Joi.string().empty(null)
        });
        return schema.validate(sellingIncentives, { abortEarly: false });
    };
    let submitEditedSellingIncentivesForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let validation = validateEditedSellingIncentivesForm();
        if (!validation.error) {
            sendEditedSellingIncentivesDataToApi();
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
    //get reason data
    let [reasonData, setReasonData] = useState([]);
    let getReasonData = async () => {
        let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/getCustomList/incentiveReason`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        setReasonData(data)
    }
    useEffect(() => {
        getReasonData()
    }, []);
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Edite Incentive</title>
            </Helmet>
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>تعديل منتج </h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form onSubmit={submitEditedSellingIncentivesForm} >
                    <div className="row gy-3">
                        <div className="col-md-4">
                            <label htmlFor="productName" className='form-label'>اسم المنتج </label>
                            <input type="text" className='form-control' name="productName"
                                defaultValue={oneIncentive?.productName}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="usage" className='form-label'>استخدامه</label>
                            <input type="text" className='form-control' name="usage"
                                defaultValue={oneIncentive?.usage}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="composition" className='form-label'> تركيب المنتج </label>
                            <input type="text" className='form-control' name="composition"
                                defaultValue={oneIncentive?.composition}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="incentiveReason_id" className='form-label'>السبب</label>
                            <select name="incentiveReason_id" className='form-control m-auto' defaultValue={0} onChange={getInputValue}>
                                <option value={0} hidden disabled>اختر</option>
                                {reasonData.map((reas) => <option key={reas.id} value={reas.id}>{reas?.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="incentivesPercentatge" className='form-label'> نسبة حافز البيع  </label>
                            <input type="text" className='form-control' name="incentivesPercentatge"
                                defaultValue={oneIncentive?.incentivesPercentatge}
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="notes" className='form-label'>ملاحظات</label>
                            <textarea name="notes" id="notes" className='form-control'
                                defaultValue={oneIncentive?.notes}
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
