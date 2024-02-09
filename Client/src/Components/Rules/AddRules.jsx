import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';

export default function AddRules() {

    let { accessToken } = useContext(AuthContext);
    //selcting form inputs to reset the form after submtion
    const formRef = useRef(null);


    let [isLoading, setIsLoading] = useState(false);
    let [rules, setRules] = useState({
        body: '',
        type_id: ''
    });
    let [ruleData, setRuleData] = useState([]);

    let getRulesData = async () => {
        let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/getCustomList/ruleType`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        setRuleData(data)   
    }
    useEffect(() => {
        getRulesData()
    }, []);
    //get the values of input and put them in the rules state
    let getInputValue = (event) => {
        let myRules = { ...rules }; //deep copy
        myRules[event.target.name] = event.target.value;
        setRules(myRules);
    };
    let sendRulesDataToApi = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/rules`, rules, {
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

    let validateRulesForm = () => {
        const schema = Joi.object({
            body: Joi.string().required(),
            type_id: Joi.string().required(),
        });
        return schema.validate(rules, { abortEarly: false });
    };
    let submitRulesForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let validation = validateRulesForm();
        if (!validation.error) {
            sendRulesDataToApi();
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
                <title>Add Rules</title>
            </Helmet>
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة تعليمات </h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form ref={formRef} onSubmit={submitRulesForm} >
                    <div className="row gy-3">
                        <div className="col-md-12">
                            <label htmlFor="body" className='form-label'>تعليمات</label>
                            <textarea className='form-control' name="body"
                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-12">
                        <label htmlFor="type_id" className='form-label'>يخص من ؟</label>
                        <select name="type_id" defaultValue={0} className='form-control' id="branch_id"
                                onChange={getInputValue}>
                                <option value={0} hidden disabled>اختار</option>
                                {ruleData.map((rule) => <option key={rule.id} value={rule?.id}>{rule?.name}</option>)}
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
