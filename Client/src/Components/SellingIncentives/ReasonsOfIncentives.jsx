import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';


export default function ReasonsOfIncentives() {
    const { accessToken } = useContext(AuthContext);
    const formInput = useRef(null);
    const [reasons, setReasons] = useState({ name: '' });
    const [reasonsData, setReasonsData] = useState([]);
    const [reasonId, setReasonId] = useState('');
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        getReasonsData();
    }, []);

    const getReasonsData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/getCustomList/incentiveReason`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setReasonsData(data);
        } catch (error) {
            toast.error('حدث خطأ أثناء جلب البيانات');
        }
    };

    const getInputValue = (event) => {
        const { name, value } = event.target;
        setReasons(prevState => ({ ...prevState, [name]: value }));
    };

    const submitReasonOrEditedReason = async (event) => {
        event.preventDefault();
        if (!reasons.name.trim()) {
            toast.error("السبب مطلوب");
            return;
        }
        try {
            if (editing) {
            let {data} =     await axios.put(`${process.env.REACT_APP_API_URL}/api/properties/${reasonId}`, reasons, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
                toast.success(data.message);
            } else {
                let {data} =     await axios.post(`${process.env.REACT_APP_API_URL}/api/properties/incentiveReason`, reasons, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
                toast.success(data.message);
            }
            setEditing(false);
            setReasons({ name: '' });
            formInput.current.reset();
            getReasonsData();
        } catch (error) {
            toast.error('حدث خطأ أثناء العملية');
        }
    };

    const handleEdit = (index) => {
        const reason = reasonsData[index];
        setReasons({ name: reason.name });
        setReasonId(reason.id);
        setEditing(true);
    };

    const deleteReason = async (reasonId) => {
        try {
         let {data} =    await axios.delete(`${process.env.REACT_APP_API_URL}/api/properties/delete/${reasonId}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            toast.success(data.message);
            getReasonsData();
        } catch (error) {
            toast.error('حدث خطأ أثناء العملية');
        }
    };

    return (
        <>
            <div className="container-fluid my-2">
                <div className='row gx-1'>
                    <div className="col-md-5">
                        <h4 className='alert alert-primary text-center'>إضافة سبب</h4>
                        <form ref={formInput} onSubmit={submitReasonOrEditedReason}>
                            <div className='w-75 m-auto'>
                                <label htmlFor="statusName" className='form-label'>السبب </label>
                                <input type="text" name="name" id="statusName" className='form-control' value={reasons.name} onChange={getInputValue} />
                                <button type='submit' className={`btn ${editing ? 'btn-outline-danger' : 'btn-outline-primary'} mt-3`}>
                                    {editing ? 'تعديل' : 'إضافة'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-7 card p-2 mt-5">
                        <h4 className='text-center text-bg-secondary py-2 rounded'>الأسباب</h4>
                        {reasonsData.length > 0 ? (
                            <div className='w-100'>
                                {reasonsData.map((reason, index) => (
                                    <div key={reason.id} className="row">
                                        <div className="col-md-8 d-flex">
                                            <p className='bg-secondary-subtle p-1 ms-2 rounded'>السبب </p>
                                            <p className='bg-body-secondary p-1 rounded'>{reason.name}</p>
                                        </div>
                                        <div className="col-md-4 d-flex">
                                            <p>
                                            <button className='btn btn-outline-danger btn-sm ms-3' onClick={() => deleteReason(reason.id)}><i className='bi bi-trash'></i> حذف </button>
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
