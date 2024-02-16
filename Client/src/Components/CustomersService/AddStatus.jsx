
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';


export default function AddStatus() {
    const { accessToken } = useContext(AuthContext);
    const [status, setStatus] = useState({ name: '' });
    const [statusData, setStatusData] = useState([]);
    const [statusId, setStatusId] = useState('');
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        getStatusData();
    }, []);

    const getStatusData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/getCustomList/status`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setStatusData(data);
        } catch (error) {
            toast.error('حدث خطأ أثناء جلب البيانات');
        }
    };

    const getInputValue = (event) => {
        const { name, value } = event.target;
        setStatus(prevState => ({ ...prevState, [name]: value }));
    };

    const submitStatusOrEditedStauts = async (event) => {
        event.preventDefault();
        if (!status.name.trim()) {
            toast.error("الحالة مطلوبة");
            return;
        }
        try {
            if (editing) {
           let {data} =     await axios.put(`${process.env.REACT_APP_API_URL}/api/properties/${statusId}`, status, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
                toast.success(data.message);
            } else {
                let {data} =   await axios.post(`${process.env.REACT_APP_API_URL}/api/properties/status`, status, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
                toast.success(data.message);
            }
            setEditing(false);
            setStatus({ name: '' });
            getStatusData();
        } catch (error) {
            toast.error('حدث خطأ أثناء العملية');
        }
    };

    const handleEdit = (index) => {
        const stat = statusData[index];
        setStatus({ name: stat.name });
        setStatusId(stat.id);
        setEditing(true);
    };

    const deleteStatus = async (statusId) => {
        try {
            let {data} =    await axios.delete(`${process.env.REACT_APP_API_URL}/api/properties/delete/${statusId}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            toast.success(data.message)
            getStatusData();
        } catch (error) {
            toast.error('حدث خطأ أثناء العملية');
        }
    };

    return (
        <>
            <div className="container-fluid my-2">
                <div className='row gx-1'>
                    <div className="col-md-5">
                        <h4 className='alert alert-primary text-center'>إضافة حالة</h4>
                        <form onSubmit={submitStatusOrEditedStauts}>
                            <div className='w-75 m-auto'>
                                <label htmlFor="statusName" className='form-label'>الحالة</label>
                                <input type="text" name="name" id="statusName" className='form-control' value={status.name} onChange={getInputValue} />
                                <button type='submit' className={`btn ${editing ? 'btn-outline-danger' : 'btn-outline-primary'} mt-3`}>
                                    {editing ? 'تعديل' : 'إضافة'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-7 card p-2 mt-5">
                        <h4 className='text-center text-bg-secondary py-2 rounded'>الحالات</h4>
                        {statusData.length > 0 ? (
                            <div className='w-100'>
                                {statusData.map((stat, index) => (
                                    <div key={stat.id} className="row">
                                        <div className="col-md-8 d-flex">
                                            <p className='bg-secondary-subtle p-1 ms-2 rounded'>الحالة</p>
                                            <p className='bg-body-secondary p-1 rounded'>{stat.name}</p>
                                        </div>
                                        <div className="col-md-4 d-flex">
                                            <p>
                                            <button className='btn btn-outline-danger btn-sm ms-3' onClick={() => deleteStatus(stat.id)}><i className='bi bi-trash'></i> حذف</button>
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
                                    <i className='fa fa-spinner fa-spin fa-2x'></i>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
