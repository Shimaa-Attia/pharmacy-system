import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';

export default function Branches() {
    const { accessToken } = useContext(AuthContext);
    const [branches, setBranches] = useState({ name: '' });
    const [branchesData, setBranchesData] = useState([]);
    const [branchId, setBranchId] = useState('');
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        getBranchesData();
    }, []);

    const getBranchesData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/getCustomList/branch`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setBranchesData(data);
        } catch (error) {
            toast.error('حدث خطأ أثناء جلب البيانات');
        }
    };

    const getInputValue = (event) => {
        const { name, value } = event.target;
        setBranches(prevState => ({ ...prevState, [name]: value }));
    };

    const submitBrancheOrEditedBranch = async (event) => {
        event.preventDefault();
        if (!branches.name.trim()) {
            toast.error("اسم الفرع مطلوب");
            return;
        }
        try {
            if (editing) {
          let {data} =     await axios.put(`${process.env.REACT_APP_API_URL}/api/properties/${branchId}`, branches, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
                toast.success(data.message);
            } else {
                let {data} =    await axios.post(`${process.env.REACT_APP_API_URL}/api/properties/branch`, branches, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
                toast.success(data.message);
            }
            setEditing(false);
            setBranches({ name: '' });
            getBranchesData();
        } catch (error) {
            toast.error('حدث خطأ أثناء العملية');
        }
    };

    const handleEdit = (index) => {
        const branch = branchesData[index];
        setBranches({ name: branch.name });
        setBranchId(branch.id);
        setEditing(true);
    };

    const deleteBranch = async (branchId) => {
        try {
            let {data} =      await axios.delete(`${process.env.REACT_APP_API_URL}/api/properties/delete/${branchId}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            toast.success(data.message);
            getBranchesData();
        } catch (error) {
            toast.error('حدث خطأ أثناء العملية');
        }
    };

    return (
        <>
            <div className="container-fluid my-2 ">
                <div className='row gx-1 '>
                    <div className="col-md-5">
                        <h4 className='alert alert-primary text-center'>إضافة فرع</h4>
                        <form onSubmit={submitBrancheOrEditedBranch}>
                            <div className='w-75 m-auto'>
                                <label htmlFor="branchName" className='form-label'>اسم الفرع</label>
                                <input type="text" name="name" id="branchName" className='form-control' value={branches.name} onChange={getInputValue} />
                                <button type='submit' className={`btn ${editing ? 'btn-outline-danger' : 'btn-outline-primary'} mt-3`}>
                                    {editing ? 'تعديل' : 'إضافة'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-7 card  p-2 mt-5">
                        <h4 className='text-center text-bg-secondary py-2 rounded'>الفروع</h4>
                        {branchesData.length > 0 ? (
                            <div className='w-100 '>
                                {branchesData.map((branch, index) => (
                                    <div key={branch.id} className={`row`}>
                                        <div className="col-md-6 d-flex">
                                            <p className='bg-secondary-subtle p-1 ms-2 rounded'>اسم الفرع</p>
                                            <p className='bg-body-secondary p-1 rounded'>{branch.name}</p>
                                        </div>
                                        <div className="col-md-4 d-flex">
                                            <p>

                                            <button className='btn btn-outline-danger btn-sm ms-3' onClick={() => deleteBranch(branch.id)}><i className='bi bi-trash'></i> حذف</button>
                                            </p>
                                            <p>

                                            <button className='btn btn-outline-primary btn-sm' onClick={() => handleEdit(index)}><i className='bi bi-pencil-square'></i> تعديل</button>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='h-75'>
                                <div className=' d-flex justify-content-center h-100 align-items-center'>
                                    <i className='fa fa-spinner fa-spin fa-2x '></i>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
