import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';
import axios from 'axios';

export default function Areas() {
    const { accessToken } = useContext(AuthContext);
    const [areas, setAreas] = useState({ name: '' });
    const [areasData, setAreasData] = useState([]);
    const [areaId, setAreaId] = useState('');
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        getAreasData();
    }, []);

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

    let getInputValue = (event) => {
        const { name, value } = event.target;
        setAreas(prevState => ({ ...prevState, [name]: value }));
    };

    let submitAreaOrEditedArea = async (event) => {
        event.preventDefault();
        if (!areas.name.trim()) {
            toast.error("المنطقة مطلوبة");
            return;
        }
        try {
            if (editing) {
                let { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/areas/${areaId}`, areas, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
                toast.success(data.message);
            } else {
                let { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/areas`, areas, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
                toast.success(data.message);
            }
            setEditing(false);
            setAreas({ name: '' });
            getAreasData();
        } catch (error) {
            toast.error('حدث خطأ أثناء العملية');
        }
    };

    let handleEdit = (index) => {
        const area = areasData[index];
        //putting name in the inputz
        setAreas({ name: area.name });
        setAreaId(area.id);
        setEditing(true);
    };
    let deleteArea = async (areaId) => {
        try {
            let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/api/areas/delete/${areaId}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            toast.success(data.message);
            getAreasData();
        } catch (error) {
            toast.error('حدث خطأ أثناء العملية');
        }
    };

    return (
        <div className="container-fluid my-2">
            <div className='row gx-1'>
                <div className="col-md-5">
                    <h4 className='alert alert-primary text-center'>إضافة منطقة</h4>
                    <form onSubmit={submitAreaOrEditedArea}>
                        <div className='w-75 m-auto'>
                            <label htmlFor="statusName" className='form-label'>المنطقة </label>
                            <input type="text" name="name" id="statusName" className='form-control' value={areas.name} onChange={getInputValue} />
                            <button type='submit' className={`btn ${editing ? 'btn-outline-danger' : 'btn-outline-primary'} mt-3`}>
                                {editing ? 'تعديل' : 'إضافة'}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="col-md-7 card p-2 mt-5">
                    <h4 className='text-center text-bg-secondary py-2 rounded'>المناطق</h4>
                    {areasData.length > 0 ? (
                        <div className='w-100'>
                            {areasData.map((area, index) => (
                                <div key={area.id} className="row">
                                    <div className="col-md-8 d-flex">
                                        <p className='bg-secondary-subtle p-1 ms-2 rounded'>المنطقة </p>
                                        <p className='bg-body-secondary p-1 rounded'>{area.name}</p>
                                    </div>
                                    <div className="col-md-4 d-flex">
                                        <p>
                                            <button className='btn btn-outline-danger btn-sm ms-3' onClick={() => deleteArea(area.id)}><i className='bi bi-trash'></i> حذف </button>
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
    );
}
