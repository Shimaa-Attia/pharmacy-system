import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Table from 'react-bootstrap/Table';
import { Helmet } from 'react-helmet';
import { AuthContext } from '../../Context/AuthStore';

export default function Users() {

  let { accessToken } = useContext(AuthContext);
  let [users, setUsers] = useState([]);


  let [searchText, setSearchText] = useState('');
  function handleSearchChange(event) {
    setSearchText(event.target.value)

  };

  let getUserData = async () => {
    let searchResult;
    if (searchText !== undefined && searchText.trim().length > 0) {
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/search/${searchText.trim()}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setUsers(searchResult.data);
      console.log('Hi from Search ')


    } else {
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`);
      console.log('Hi from No Search ');
      setUsers(searchResult.data.data);
    }


  }
  useEffect(() => { getUserData() }, [searchText]);

  let showUsers = () => {
    if (users.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 border  ">
          <table responsive='sm' className='table table-bordered  table-hover text-center table-responsive-list '>
            <thead className='table-primary' >
              <tr >
                <th  >خيارات</th>
                <th>رقم الهاتف</th>
                <th>الوظيفة</th>
                <th>الاسم</th>
                <th>كود المستخدم</th>
                <th>رقم</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => <tr key={user.id}>
                <td  data-label="خيارات">
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
                <td  data-label="رقم الهاتف">{user.phone}</td>
                <td data-label="الوظيفة">{user.role}</td>
                <td  data-label="اسم المستخدم">{user.name}</td>
                <td  data-label="كود المستخدم">{user.code}</td>
                <td  data-label="#">{++index}</td>
              </tr>
              )}
            </tbody>

          </table>
        </div>
      )
    } else {

      return (
        <div className=' d-flex justify-content-center height-calc-70 align-items-center' >
          <i className='fa fa-spinner fa-spin fa-5x'></i>


        </div>)

    }
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title> Users</title>
      </Helmet>
      <div className=" my-3 text-center row mx-2  ">
        <div className="col-md-6">
          <NavLink to='/users/add' className='btn btn-primary mb-1' >إضافة مستخدم</NavLink>
        </div>
        <div className="col-md-4">
          <input type="text" className='form-control text-end  mt-1 ' placeholder=' ...بحث عن مستخدم   ' onChange={handleSearchChange} />
        </div>
      </div>
      {showUsers()}
    </>
  )
} 
