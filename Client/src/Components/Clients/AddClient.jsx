import React, { useContext, useEffect } from 'react'
import axios from 'axios';
import Joi from 'joi';
import { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Field, Form, Formik } from "formik";
import { Helmet } from 'react-helmet';
import { AuthContext } from '../../Context/AuthStore';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';


export default function AddClient() {
    let { accessToken } = useContext(AuthContext);


    let [isLoading, setIsLoading] = useState(false);

    let initialValues = {
        code: '',
        name: '',
        areas: [],
        defualtArea_id: '',
        phones: [],
        addresses: [],
        onHim: '',
        forHim: '',
        notes: ''
    }
    let [clientData, setClientData] = useState({ ...initialValues });
    //getting areas data to display in select 
    let [areasData, setAreasData] = useState([]);
    let getAreasData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/areas`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setAreasData(data);
        } catch (error) {
            toast.error('حدث خطأ أثناء جلب البيانات');
        }
    }
    useEffect(() => {
        getAreasData();
    }, []);
    //making map on the areas data to display the name in the option
    let [areasOptions, setAreasOptions] = useState([])
    useEffect(() => {
        let mapAreas = areasData?.map((area) => ({
            value: `${area.id}`,
            label: `${area.name}`
        }));
        setAreasOptions(mapAreas);
    }, [areasData]);
    let handleAreasAndPhonessChange = (selectedOption, fieldName) => {
        let selectedValues = selectedOption.map((opt) => opt.value)
        setClientData(prevData => ({
            ...prevData,
            [fieldName.name]: selectedValues
        }));
    };
    let handleDefualtAreaChange = (selectedOption) => {
        setClientData(prevData => ({
            ...prevData,
            defualtArea_id: selectedOption.value
        }));
    };
    let getInputValue = (event) => {
        let { name, value } = event.target;
        setClientData(prevState => ({ ...prevState, [name]: value }));
    };

    let sendClientDataToApi = async () => {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/customers`, clientData, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((res) => {
            toast.success(res.data.message, {
                position: 'top-center'
            });
            setIsLoading(false);
            setClientData({ ...initialValues });
        }).catch((errors) => {
            console.log(errors);
            setIsLoading(false);
            try {
                const errorList = errors?.response?.data?.message;
                if (errorList !== undefined) {
                    Object.keys(errorList).map((err) => {
                        errorList[err].map((err) => {
                            toast.error(err);
                        })
                    });
                }
            } catch (error) {
                toast.error('حدث خطأ ما')
            }

        });
    };
    let validateClientForm = () => {
        const schema = Joi.object({
            name: Joi.string().required(),
            code: Joi.string().required(),
            phones: Joi.any().empty(''),
            addresses: Joi.any().empty(''),
            areas: Joi.any().empty(''),
            defualtArea_id: Joi.string().required().messages({
                'string.empty': 'يجب إدخال المنطقة الإفتراضية',
            }),
            onHim: Joi.number().empty(''),
            forHim: Joi.number().empty(''),
            notes: Joi.string().empty(''),

        });

        return schema.validate(clientData, { abortEarly: false });

    };

    let submitClientForm = (e) => {
        e.preventDefault();
        setIsLoading(true);
        let validation = validateClientForm();
        if (!validation.error) {
            sendClientDataToApi();
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

    };


    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Add Client</title>
            </Helmet>
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة عميل جديد</h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">


                <form className="row g-3" onSubmit={submitClientForm}>
                    <div className="col-md-6">
                        <label htmlFor="code" className='form-label'>كود العميل</label>
                        <input type="text" className='form-control' name="code" id="code" onChange={getInputValue} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="name" className='form-label'>الاسم</label>
                        <input type="text" className='form-control' name="name" id="name" onChange={getInputValue} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="defualtArea_id" className='form-label'> المنطقة الإفتراضية</label>
                        <Select
                            // ref={clientSelectRef}
                            name="defualtArea_id"
                            options={areasOptions}
                            onChange={handleDefualtAreaChange}
                            isSearchable={true}
                            placeholder="بحث عن منطقة..."

                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="areas" className='form-label'>المناطق الأخرى</label>
                        <Select
                            // ref={clientSelectRef}
                            name="areas"
                            options={areasOptions}
                            isMulti
                            onChange={handleAreasAndPhonessChange}
                            isSearchable={true}
                            placeholder="بحث عن منطقة..."

                        />
                    </div>
                    {/* <div className="col-md-6">
                                        <label htmlFor="addresses" className='form-label'>العناوين</label>
                                        <CreatableSelect
                                            name="addresses"
                                            isMulti
                                            onChange={handleSelectChange}
                                            isSearchable={true}
                                            placeholder="إضافة عنوان..."

                                        />
                                    </div> */}
                    <div className="col-md-6">
                        <label htmlFor="phones" className='form-label'>أرقام الهواتف</label>
                        <CreatableSelect
                            name="phones"
                            isMulti
                            onChange={handleAreasAndPhonessChange}
                            isSearchable={true}
                            placeholder="إضافة هاتف..."

                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="onHim" className='form-label'>عليه</label>
                        <input type="text" className='form-control' name="onHim" id="onHim" onChange={getInputValue} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="forHim" className='form-label'>له</label>
                        <input type="text" className='form-control' name="forHim" id="forHim" onChange={getInputValue} />
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="notes" className='form-label'>ملاحظات</label>
                        <textarea type="text" id="notes" className='form-control' name="notes" onChange={getInputValue} />
                    </div>
                    <div className="col-md-3">
                        <button type='submit' className='btn btn-primary form-control fs-5'>
                            {isLoading == true ?
                                <i className='fa fa-spinner fa-spin'></i> : 'إضافة'}
                        </button>
                    </div>
                 
                </form>


            </div>
        </>
    )
}
