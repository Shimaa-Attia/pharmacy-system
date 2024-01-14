import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';
import Joi from 'joi';

export default function AddStatus() {
    //Adding status
    let { accessToken } = useContext(AuthContext);
    let formInput = document.getElementById('statusName');
    let [status, setStatus] = useState({
        name: ''
    })
    let getInputValue = (event) => {
        let myStatus = { ...status };
        myStatus[event?.target?.name] = event?.target?.value;
        setStatus(myStatus);
    }
    let sendStatusDataToApi = async () => {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/properties/status`, status, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((res) => {
            console.log(res);
            toast.success(res.data.message);
            formInput.value = '';

        }).catch((errors) => {
            console.log(errors);
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

    let validateStatusForm = () => {
        const schema = Joi.object({
            name: Joi.string().required(),
        });
        return schema.validate(status, { abortEarly: false });
    };
    let submitStatusForm = () => {
        let validation = validateStatusForm();
        if (!validation.error) {
            sendStatusDataToApi()
            setStatus({
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

    //Show Status
    let [statusData, setStatusData] = useState([]);

    let getStatusData = async () => {
        let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/getCustomList/status`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        console.log(data);
        setStatusData(data)
        
    }
    useEffect(() => {
        getStatusData()
    }, []);

    let [statusId, setStatusId] = useState('');
    let showStatus = () => {
        if (statusData.length > 0) {
            return (
                <div className='w-100 ' >
                    {statusData.map((stat, index) => <div key={stat.id}>

                        <div className={`row `}>
                            <div className="col-md-8 d-flex ">
                                <p className='bg-secondary-subtle p-1 ms-2 rounded' >الحالة  </p>
                                <p className='bg-body-secondary p-1 rounded'>{stat?.name}</p>
                            </div>
                            <div className="col-md-4 d-flex">
                                <p>
                                    <button className='btn btn-outline-danger btn-sm ms-3' onClick={() => { deleteStatus(stat.id) }} ><i className='bi bi-trash'></i> حذف </button> </p>
                                <p> <button className='btn btn-outline-primary btn-sm' onClick={() => {
                                    getInputInfo(index)
                                    setStatusId(stat.id)
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

    //delete branch
    let deleteStatus = async (statId) => {
        try {

            let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/api/properties/delete/${statId}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            toast.success(data.message);
            getStatusData()
        } catch (error) {

            toast.error('حدث خطأ ما، حاول مرة أخرى')
        }
    };

    //Edite status
 
    let sendEditedStatusDataToApi = async (statId) => {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/properties/${statId}`, status, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((res) => {
            toast.success(res.data.message);
            formInput.value = '';
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

    let validateEditedStautsForm = () => {
        const schema = Joi.object({
            name: Joi.string().empty(''),
        });
        return schema.validate(status, { abortEarly: false });
    };
    let submitEditedStautsForm = () => {
        let validation = validateEditedStautsForm();
        if (!validation.error) {
            sendEditedStatusDataToApi(statusId);
            setStatus({
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
    let submitStatusOrEditedStauts= (e) => {
        e.preventDefault();
        if (mainBtn.innerHTML === 'إضافة') {
            submitStatusForm()
            getStatusData()
        } else {
            submitEditedStautsForm()
            getStatusData()
            mainBtn.innerHTML = 'إضافة'
            mainBtn.classList.remove('btn-outline-danger');
        }
    }
    let statusNameInput = document.getElementById('statusName')
    let getInputInfo = (index) => {
        statusNameInput.value = statusData[index]?.name;
        statusNameInput.focus();
        setStatus({
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
                        <h4 className='alert alert-primary text-center'>إضافة حالة</h4>
                        <form onSubmit={submitStatusOrEditedStauts}>
                            <div className='w-75 m-auto'>
                                <label htmlFor="statusName" className='form-label'>الحالة </label>
                                <input type="text" name="name" id="statusName" className='form-control' onChange={getInputValue} />
                                <button type='submit' className='btn btn-outline-primary mt-3' id='mainBtn' >إضافة</button>
                            </div>
                        </form>

                    </div>
                    <div className="col-md-7 card  p-2 mt-5">
                        <h4 className='text-center text-bg-secondary py-2 rounded' >الحالات</h4>
                        {showStatus()}
                    </div>

                </div>
            </div>


        </>
    )
}
