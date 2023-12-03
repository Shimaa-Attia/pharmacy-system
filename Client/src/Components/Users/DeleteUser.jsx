import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Login from '../Login/Login';

export default function DeleteUser() {
    let [users, setUsers] = useState({
        id: 0,
        name: '',
        role: '',
        phone: '',
        salary: 0,
        code: '',
        hourRate: 0,
        notes: '',
    });
    let id = useParams();
    let navigate = useNavigate();
    let getUser = async () => {
        let { data } = await axios.get(`http://pharma-erp.atomicsoft-eg.com/api/users/${id}`);
        setUsers(data.data);
    }
    //   useEffect(()=>{getUser()} , []);   

    let deleteUser = async () => {
        axios.delete(`http://pharma-erp.atomicsoft-eg.com/api/users/${id}`);
        navigate('../Users')
    }



    return (
        <>
            <h4 className='alert alert-primary m-3 text-center' >هل أنت متأكد من حذف هذا العميل؟</h4>
            <button  className='btn btn-danger' onClick={deleteUser} >حذف العميل</button>

        </>
    )
}
