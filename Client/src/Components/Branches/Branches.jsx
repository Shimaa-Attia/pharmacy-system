import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';
import Joi from 'joi';

export default function Branches() {
    //Adding branch
    let { accessToken } = useContext(AuthContext);
    let formInput = document.getElementById('branchName');
    let [branches, setBranches] = useState({
        name: ''
    })
    let getInputValue = (event) => {
        let myBranches = { ...branches };
        myBranches[event?.target?.name] = event?.target?.value;
        setBranches(myBranches);
    }
    let sendBranchesDataToApi = async () => {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/properties/branch`, branches, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((res) => {
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

    let validateBranchForm = () => {
        const schema = Joi.object({
            name: Joi.string().required(),
        });
        return schema.validate(branches, { abortEarly: false });
    };
    let submitBranchesForm = () => {
        let validation = validateBranchForm();
        if (!validation.error) {
            sendBranchesDataToApi()
            setBranches({
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

    //Show Branches
    let [branchesData, setBranchesData] = useState([]);

    let getBranchesData = async () => {
        let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/getCustomList/branch`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        setBranchesData(data)
        
    }
    useEffect(() => {
        getBranchesData()
    }, []);

    let [branchId, setBranchId] = useState('');
    let showBranches = () => {
        if (branchesData.length > 0) {
            return (
                <div className='w-100 ' >
                    {branchesData.map((branch, index) => <div key={branch.id}>

                        <div className={`row `}>
                            <div className="col-md-6 d-flex ">
                                <p className='bg-secondary-subtle p-1 ms-2 rounded' >اسم الفرع </p>
                                <p className='bg-body-secondary p-1 rounded'>{branch?.name}</p>
                            </div>
                            <div className="col-md-4 d-flex">
                                <p>
                                    <button className='btn btn-outline-danger btn-sm ms-3' onClick={() => { deleteBranch(branch.id) }} ><i className='bi bi-trash'></i> حذف </button> </p>
                                <p> <button className='btn btn-outline-primary btn-sm' onClick={() => {
                                    getInputInfo(index)
                                    setBranchId(branch.id)
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
    let deleteBranch = async (branId) => {
        try {

            let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/api/properties/delete/${branId}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            toast.success(data.message);
            getBranchesData()
        } catch (error) {

            toast.error('حدث خطأ ما، حاول مرة أخرى')
        }
    };

    //Edite branches 
    let [edtitedBranches, setEditedBranches] = useState({
        name: ''
    })
    let sendEditedBranchesDataToApi = async (branId) => {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/properties/${branId}`, branches, {
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

    let validateEditedBranchForm = () => {
        const schema = Joi.object({
            name: Joi.string().empty(''),
        });
        return schema.validate(branches, { abortEarly: false });
    };
    let submitEditedBranchesForm = () => {
        let validation = validateEditedBranchForm();
        if (!validation.error) {
            sendEditedBranchesDataToApi(branchId);
            setBranches({
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
    let submitBrancheOrEditedBranch = (e) => {
        e.preventDefault();
        if (mainBtn.innerHTML === 'إضافة') {
            submitBranchesForm()
            getBranchesData()
        } else {
            submitEditedBranchesForm()
            getBranchesData()
            mainBtn.innerHTML = 'إضافة'
            mainBtn.classList.remove('btn-outline-danger');
        }
    }
    let branchNameInput = document.getElementById('branchName')
    let getInputInfo = (index) => {
        branchNameInput.value = branchesData[index]?.name;
        branchNameInput.focus();
        setBranches({
            name: branchNameInput.value,
        })
        mainBtn.innerHTML = 'تعديل';
        mainBtn.classList.add('btn-outline-danger');
    }

    return (
        <>
            <div className="container-fluid my-2 ">
                <div className='row gx-1 '>
                    <div className="col-md-5">
                        <h4 className='alert alert-primary text-center'>إضافة فرع</h4>
                        <form onSubmit={submitBrancheOrEditedBranch}>
                            <div className='w-75 m-auto'>
                                <label htmlFor="branchName" className='form-label'>اسم الفرع</label>
                                <input type="text" name="name" id="branchName" className='form-control' onChange={getInputValue} />
                                <button type='submit' className='btn btn-outline-primary mt-3' id='mainBtn' >إضافة</button>
                            </div>
                        </form>

                    </div>
                    <div className="col-md-7 card  p-2 mt-5">
                        <h4 className='text-center text-bg-secondary py-2 rounded' >الفروع</h4>
                        {showBranches()}
                    </div>

                </div>
            </div>


        </>
    )
}
