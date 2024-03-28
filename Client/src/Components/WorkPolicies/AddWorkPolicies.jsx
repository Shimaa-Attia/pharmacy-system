
import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';

import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';

export default function AddWorkPolicies() {

    let { accessToken } = useContext(AuthContext);
    //selcting form inputs to reset the form after submtion
    const formRef = useRef(null);


    let [isLoading, setIsLoading] = useState(false);
    let [workPolicies, setWorkPolicies] = useState({
        body: '',
        type_id: ''
    });
    let [workPoliciesData, setWorkPoliciesData] = useState([]);

    let getWorkPoliciesData = async () => {
        let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/getCustomList/policieType`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        setWorkPoliciesData(data)
    }
    useEffect(() => {
        getWorkPoliciesData()
    }, []);
    //get the values of input and put them in the work policy state
    let getInputValue = (event) => {
        let myWorkPolicies = { ...workPolicies }; //deep copy
        myWorkPolicies[event.target.name] = event.target.value;
        setWorkPolicies(myWorkPolicies);
    };
    let sendWorkPoliciesDataToApi = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/workPolicies`, workPolicies, {
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
                try {
                    if (errorList !== undefined) {
                        Object.keys(errorList)?.map((err) => {
                            errorList[err]?.map((err) => {
                                toast.error(err);
                            })
                        });
                    } else {
                        toast.error("حدث خطأ ما");
                    }
                } catch (error) {
                    toast.error("حدث خطأ ما");
                }

            });
        } catch (error) {
            toast.error("حدث خطأ ما");
        }
    };

    let validateWorkPoliciesForm = () => {
        const schema = Joi.object({
            body: Joi.string().required(),
            type_id: Joi.string().required(),
        });
        return schema.validate(workPolicies, { abortEarly: false });
    };
    let submitWorkPoliciesForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let validation = validateWorkPoliciesForm();
        if (!validation.error) {
            sendWorkPoliciesDataToApi();
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
                <title>Add Work Policies</title>
            </Helmet>
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة سياسات العمل </h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form ref={formRef} onSubmit={submitWorkPoliciesForm} >
                    <div className="row gy-3">
                        <div className="col-md-12">
                            <label htmlFor="body" className='form-label'>السياسية</label>
                            <textarea className='form-control' name="body"
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="type_id" className='form-label'>سياسية ماذا ؟ </label>
                            <select name="type_id" defaultValue={0} className='form-control' id="branch_id"
                                onChange={getInputValue}>
                                <option value={0} hidden disabled>اختر...</option>
                                {workPoliciesData.map((polic) => <option key={polic.id} value={polic?.id}>{polic?.name}</option>)}
                            </select>
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
