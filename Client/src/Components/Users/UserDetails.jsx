import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function UserDetails() {
  let accessToken = localStorage.getItem('userToken');
  let [users, setUsers] = useState([]);
  let { id } = useParams();
  let navigate = useNavigate();
  let getUserDetails = async () => {
    try {
      let { data } = await axios.get(`http://pharma-erp.atomicsoft-eg.com/api/users/show/${id}`);
      setUsers(data.data);

    } catch (error) {
      toast.error('حدث خطأ ما، حاول مرة أخرى')

    }

  };
  useEffect(() => { getUserDetails() }, []);
  return (
    <>
      <h4 className='text-center alert alert-primary m-3 '>تفاصيل بيانات ({users.name})</h4>
      <div className="card w-50 m-auto p-3 ">

        <div className='text-center rounded ' style={{ backgroundColor: ' rgb(149, 171, 240)' }}>
          <h2 > الاسم : {users.name}</h2>
        </div>
        <div className='text-center rounded my-3 ' style={{ backgroundColor: ' rgb(149, 171, 240)' }}>
          <h3  > كود العميل : {users.code}</h3>
        </div>
        <div className='text-center rounded ' style={{ backgroundColor: ' rgb(149, 171, 240)' }}>
          <h4 className='h3'> الوظيفة : {users.role}</h4>
        </div>
        <div className='text-center rounded my-3 ' style={{ backgroundColor: ' rgb(149, 171, 240)' }}>
          <h5 className='h3' > رقم الهاتف : {users.phone}</h5>
        </div>
        <div className='text-center rounded ' style={{ backgroundColor: ' rgb(149, 171, 240)' }}>
          <h5 className='h3' > الراتب : {users.salary}</h5>
        </div>
        <div className='text-center rounded my-3 ' style={{ backgroundColor: ' rgb(149, 171, 240)' }}>
          <h5 className='h3' > سعر الساعة : {users.hourRate}</h5>
        </div>
        {users.notes ? <div className='text-center rounded ' style={{ backgroundColor: ' rgb(149, 171, 240)' }}>
          <h5 className='h3' > ملاحظات : {users.notes}</h5>
        </div> : '' }
    
      </div>
      <div className="col-md-2 m-auto my-2">
        <NavLink to='/users' className='btn  btn-secondary form-control mx-2 '>رجوع</NavLink>
      </div>

    </>
  )
}
