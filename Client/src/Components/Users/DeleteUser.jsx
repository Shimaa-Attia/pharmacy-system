import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';


export default function DeleteUser() {
    let { accessToken } = useContext(AuthContext);
    let { id } = useParams();
    let navigate = useNavigate();
 

    let [users, setUsers] = useState([]);
    let getUser = async () => {
        try {
            let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/show/${id}`);
            setUsers(data.data);

        } catch (error) {
            toast.error('حدث خطأ ما، حاول مرة أخرى')
        }

    };
    useEffect(() => { getUser() }, []);
    let deleteUser = async () => {
        try {
            axios.delete(`${process.env.REACT_APP_API_URL}/api/users/delete/${id}`, {
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
            <Helmet>
                <meta charSet="utf-8" />
                <title>Delete Usera</title>
            </Helmet>
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
