import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';


export default function DeleteUser() {

    let { id } = useParams();
    let navigate = useNavigate();
    let accessToken = localStorage.getItem('userToken');

    let [users, setUsers] = useState([]);
    let getUser = async () => {
        try {
            let { data } = await axios.get(`http://pharma-erp.atomicsoft-eg.com/api/users/show/${id}`);
            setUsers(data.data);

        } catch (error) {
            toast.error('حدث خطأ ما، حاول مرة أخرى')

        }

    };
    useEffect(() => { getUser() }, []);
    let deleteUser = async () => {
        try {
            axios.delete(`http://pharma-erp.atomicsoft-eg.com/api/users/delete/${id}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            navigate('/users')
            toast.success('تم حذف المستخدم بنجاح');

        } catch (error) {
            toast.error('حدث خطأ ما، حاول مرة أخرى')

        }

    };



    return (
        <>
            <h4 className='alert alert-primary m-3 text-center' >هل أنت متأكد من حذف ({users.name})؟</h4>
            <div className="card m-auto w-50 p-3">
                <div className="card-body  ">
                    <h4 className="card-title  "> الاسم : {users.name}</h4>
                    <h5 className='my-3'> كود المستخدم : {users.code}</h5>
                    <h5 className='my-3'> الوظيفة : {users.role}</h5>
                    <h5> رقم الهاتف : {users.phone}</h5>

                </div>
            </div>

            <div className="col-md-3 d-flex m-auto mt-3 ">
                <NavLink to='../users' className='btn  btn-secondary form-control mx-2 '>رجوع</NavLink>
                <button className='btn btn-danger form-control mx-2' onClick={deleteUser} >حذف العميل</button>
            </div>


        </>
    )
}
