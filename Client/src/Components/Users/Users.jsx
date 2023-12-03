import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import AddUser from './AddUser';




export default function Users() {
  let navigate = useNavigate();
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

  let getUserDate = async () => {
    let { data } = await axios.get(`http://pharma-erp.atomicsoft-eg.com/api/users`);
    setUsers(data.data);

  }
  useEffect(() => { getUserDate() }, []);
  let showUsers = () => {


    if (users.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 ">
          <table className='table table-bordered table-hover  '>
            <thead>
              <tr>
                <th>خيارات</th>
                <th>الراتب</th>
                <th>سعر الساعة</th>
                <th>رقم الهاتف</th>
                <th>الوظيفة</th>
                <th>الاسم</th>
                <th>كود العميل</th>
                <th>#</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => <tr key={user.id}>
                <td>
                  <NavLink to='../delete' >
                  <i className='bi bi-trash text-bg-danger p-1 mx-1 rounded'></i>
                  </NavLink>
                  <NavLink to='../edite' >
                  <i className='bi bi-pencil-square text-bg-primary mx-1 p-1 rounded'></i>
                  </NavLink>
                  <NavLink to='../details' >
                  <i className='bi bi-list-ul text-bg-success mx-1 p-1 rounded'></i>
                  </NavLink>
                </td>
                <td>{user.salary}</td>
                <td>{user.hourRate}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>{user.name}</td>
                <td>{user.code}</td>
                <td>{user.id}</td>  
              </tr>
              )}
            </tbody>

          </table>
        </div>
      )
    } else {
      return (
      <div className=' d-flex justify-content-center min-vh-100  align-items-center' >
        <i className='fa fa-spinner fa-spin fa-5x'></i>
      </div>)

    }
  }

  return (
    <>
      <div className=" my-3 text-center ">
        <NavLink to='../add' className='btn btn-primary' >إضافة مستخدم</NavLink>
      </div>
      {showUsers()}
    </>
  )
}
