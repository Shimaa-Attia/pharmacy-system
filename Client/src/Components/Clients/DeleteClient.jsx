import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Login from '../Login/Login';
import { toast } from 'react-toastify';

export default function DeleteClient() {
    let { id } = useParams();
    let navigate = useNavigate();
    let accessToken = localStorage.getItem('userToken');
    let [clients, setClients] = useState([]);

    let getClient = async () => {
        try {
            let { data } = await axios.get(`http://127.0.0.1:8000/api/customers/show/${id}`,{
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                } 
            });
            setClients(data.data);

        } catch (error) {
            toast.error('حدث خطأ ما، حاول مرة أخرى')
        }
    };
    useEffect(() => { getClient() }, []);
    let deleteClient = async () => {
        try {
            axios.delete(`http://127.0.0.1:8000/api/customers/delete/%7${id}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            navigate('/clients')
            toast.success('تم حذف العميل بنجاح');

        } catch (error) {
            toast.error('حدث خطأ ما، حاول مرة أخرى')

        }

    };

  return (
    <>
    
    
    </>
  )
}
