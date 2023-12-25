import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';

export default function UserDetails() {
  let { accessToken } = useContext(AuthContext);
  let [users, setUsers] = useState([]);
  let { id } = useParams();

  let getUserDetails = async () => {
    try {
      let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/show/${id}`,{
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setUsers(data.data);

    } catch (error) {
      toast.error('حدث خطأ ما، حاول مرة أخرى')

    }

  };
  useEffect(() => {
    getUserDetails()
  }, []);
  return (
    <>
     <Helmet>
        <meta charSet="utf-8" />
        <title> User Details</title>
      </Helmet>
      <h4 className='text-center alert alert-primary m-3 '>تفاصيل بيانات ({users.name})</h4>
      <div className="card w-75 m-auto  p-5 ">
        <div className="row  ">
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 mt-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h2 > الاسم : {users.name} </h2>
            </div>
          </div>
          <div className='col-md-6 '>
            <div className="text-center rounded p-2 mt-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3  > كود المستخدم : {users.code}</h3>
            </div>
          </div>

          <div className='col-md-6 ' >
            <div className="text-center rounded p-2 my-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }}>
              <h4 className='h3'> الوظيفة : {users.role}</h4>
            </div>
          </div>
          <div className='col-md-6 ' >
            <div className="text-center rounded p-2 my-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }}>
              <h5 className='h3' > رقم الهاتف : {users.phone}</h5>
            </div>
          </div>
          <div className='col-md-6 ' >
            <div className="text-center rounded p-2 my-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }}>
              <h5 className='h3' > الراتب : {users.salary}</h5>
            </div>
          </div>
          <div className='col-md-6 ' >
            <div className="text-center rounded p-2 my-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }}>
              <h5 className='h3' > سعر الساعة : {users.hourRate}</h5>
            </div>
          </div>
          {users.notes ?
            <div className='col-md-12 ' >
              <div className="text-center rounded p-2 my-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }}>
                <h5 className='h3' > ملاحظات : {users.notes}</h5>
              </div>
            </div> : ''
          }
        </div>

      </div>
      <div className="col-md-2 m-auto my-2">
        <NavLink to='/users' className='btn  btn-secondary form-control mx-2 '>رجوع</NavLink>
      </div>

    </>
  )
}
