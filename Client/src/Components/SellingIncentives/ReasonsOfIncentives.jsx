
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';
import Joi from 'joi';

export default function ReasonsOfIncentives() {
    //Adding status
    let { accessToken } = useContext(AuthContext);
    let formInput = useRef()
    let [reasons, setReasons] = useState({
        name: ''
    })
    let getInputValue = (event) => {
        let myReasons = { ...reasons };
        myReasons[event?.target?.name] = event?.target?.value;
        setReasons(myReasons);
    }
    let sendReasonsDataToApi = async () => {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/properties/incentiveReason`, reasons, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((res) => {
            toast.success(res.data.message);
            formInput.current.reset()

        }).catch((errors) => {
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
        })
    };

    let validateReasonsForm = () => {
        const schema = Joi.object({
            name: Joi.string().required(),
        });
        return schema.validate(reasons, { abortEarly: false });
    };
    let submitReasonsForm = () => {
        let validation = validateReasonsForm();
        if (!validation.error) {
            sendReasonsDataToApi()
            setReasons({
                name: ''
            })
        } else {
            try {
                validation.error.details.map((err) => {
                    toast.error(err.message);
                })
            } catch (e) {
                toast.error("حدث خطأ ما");
            }
        }
    };

    //Show Reasons
    let [reasonsData, setReasonsData] = useState([]);
    let getReasonsData = async () => {
        let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/getCustomList/incentiveReason`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        setReasonsData(data)
    }
    useEffect(() => {
        getReasonsData()
    }, []);

    let [reasonId, setReasonId] = useState('');
    let showReasons = () => {
        if (reasonsData.length > 0) {
            return (
                <div className='w-100 ' >
                    {reasonsData.map((reason, index) => <div key={reason.id}>

                        <div className={`row `}>
                            <div className="col-md-8 d-flex ">
                                <p className='bg-secondary-subtle p-1 ms-2 rounded' >السبب  </p>
                                <p className='bg-body-secondary p-1 rounded'>{reason?.name}</p>
                            </div>
                            <div className="col-md-4 d-flex">
                                <p>
                                    <button className='btn btn-outline-danger btn-sm ms-3' onClick={() => { deleteReason(reason.id) }} ><i className='bi bi-trash'></i> حذف </button>
                                </p>
                                <p> <button className='btn btn-outline-primary btn-sm' onClick={() => {
                                    getInputInfo(index)
                                    setReasonId(reason.id)
                                }}><i className='bi bi-pencil-square'></i> تعديل  </button></p>
                            </div>

                        </div>
                    </div>)}

                </div>
            )
        } else {
            return (
                <div className='h-75' >
                    <div className=' d-flex justify-content-center h-100  align-items-center' >
                        <i className='fa fa-spinner fa-spin fa-2x '></i>
                    </div>
                </div>
            )
        }
    }

    //delete reason
    let deleteReason = async (reasId) => {
        try {
            let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/api/properties/delete/${reasId}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            toast.success(data.message);
            getReasonsData()
        } catch (error) {
            toast.error('حدث خطأ ما، حاول مرة أخرى')
        }
    };

    //Edite reason
    let sendEditedReasonDataToApi = async (reasId) => {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/properties/${reasId}`, reasons, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((res) => {
            toast.success(res.data.message);
            formInput.current.reset()
        }).catch((errors) => {
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
        })
    };

    let validateEditedReasonForm = () => {
        const schema = Joi.object({
            name: Joi.string().empty(''),
        });
        return schema.validate(reasons, { abortEarly: false });
    };
    let submitEditedReasonForm = () => {
        let validation = validateEditedReasonForm();
        if (!validation.error) {
            sendEditedReasonDataToApi(reasonId);
            setReasons({
                name: ''
            })
        } else {
            try {
                validation.error.details.map((err) => {
                    toast.error(err.message);
                })
            } catch (e) {
                toast.error("حدث خطأ ما");
            }
        }
    };
    let mainBtn = document.getElementById('mainBtn');
    let submitReasonOrEditedReason = (e) => {
        e.preventDefault();
        if (mainBtn.innerHTML === 'إضافة') {
            submitReasonsForm()
            getReasonsData()
        } else {
            submitEditedReasonForm()
            getReasonsData()
            mainBtn.innerHTML = 'إضافة'
            mainBtn.classList.remove('btn-outline-danger');
        }
    }
    let statusNameInput = document.getElementById('statusName')
    let getInputInfo = (index) => {
        statusNameInput.value = reasonsData[index]?.name;
        statusNameInput.focus();
        setReasons({
            name: statusNameInput.value,
        })
        mainBtn.innerHTML = 'تعديل';
        mainBtn.classList.add('btn-outline-danger');
    }

    return (
        <>
            <div className="container-fluid my-2 ">
                <div className='row gx-1 '>
                    <div className="col-md-5">
                        <h4 className='alert alert-primary text-center'>إضافة سبب</h4>
                        <form ref={formInput} onSubmit={submitReasonOrEditedReason}>
                            <div className='w-75 m-auto'>
                                <label htmlFor="statusName" className='form-label'>السبب </label>
                                <input type="text" name="name" id="statusName" className='form-control' onChange={getInputValue} />
                                <button type='submit' className='btn btn-outline-primary mt-3' id='mainBtn' >إضافة</button>
                            </div>
                        </form>

                    </div>
                    <div className="col-md-7 card  p-2 mt-5">
                        <h4 className='text-center text-bg-secondary py-2 rounded' >الأسباب</h4>
                        {showReasons()}
                    </div>

                </div>
            </div>


        </>
    )
}
