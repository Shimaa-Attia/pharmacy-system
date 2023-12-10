import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Table from 'react-bootstrap/Table';

export default function Users() {
  let [users, setUsers] = useState([]);

  let getUserData = async () => {
    try {
      let { data } = await axios.get(`http://127.0.0.1:8000/api/users`);
      setUsers(data.data);
      
    } catch (error) {
      toast.error('حدث خطأ ما' ,{
        position:'top-right'
      })
      
    }
   
  };
  useEffect(() => { getUserData() }, []);
  
  let showUsers = () => {
    if (users.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 ">
          <Table responsive='sm' className='table table-bordered table-hover text-center '>
            <thead>
              <tr>
                <th>خيارات</th>
                <th>رقم الهاتف</th>
                <th>الوظيفة</th>
                <th>الاسم</th>
                <th>كود العميل</th>
                <th>id</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => <tr key={user.id}>
                <td>
                  <NavLink to={`/users/delete/${user.id}`} >
                  <i className='bi bi-trash text-bg-danger p-1 mx-1 rounded'></i>
                  </NavLink>
                  <NavLink to={`/users/edite/${user.id}`} >
                  <i className='bi bi-pencil-square text-bg-primary mx-1 p-1 rounded'></i>
                  </NavLink>
                  <NavLink to={`/users/details/${user.id}`} >
                  <i className='bi bi-list-ul text-bg-success mx-1 p-1 rounded'></i>
                  </NavLink>
                </td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>{user.name}</td>
                <td>{user.code}</td>
                <td>{user.id}</td>  
              </tr>
              )}
            </tbody>

          </Table>
        </div>
      )
    } else {
      return (
      <div className=' d-flex justify-content-center min-vh-100  align-items-center' >
        <i className='fa fa-spinner fa-spin fa-5x'></i>
      </div>)

    }
  };

  return (
    <>
      <div className=" my-3 text-center ">
        <NavLink to='/users/add' className='btn btn-primary' >إضافة مستخدم</NavLink>
      </div>
      {showUsers()}
    </>
  )
} 
