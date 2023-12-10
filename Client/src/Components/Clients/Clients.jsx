import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

export default function Clients() {
  let accessToken = localStorage.getItem('userToken');
  let [clients, setClients] = useState([]);

let [contactInfo , setContactInfo] = useState([]);
  let getClientDate = async () => {
    let { data } = await axios.get(`http://pharma-erp.atomicsoft-eg.com/api/customers` , {
      headers: {
        "Authorization": `Bearer ${accessToken}`
    }
    });
    console.log(data.data);
    setClients(data.data);
    setContactInfo(data.data.contactInfo)
    console.log(contactInfo.name);
  };
  
  useEffect(() => { getClientDate() }, []);

  let showClients = () => {
    if (clients.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 ">
          <table className='table table-bordered table-hover text-center '>
            <thead>
              <tr>
                <th>خيارات</th>
                <th>ملاحظات</th>
                <th>العناوين</th>
                <th>أرقام الهواتف</th>
                <th>الاسم</th>
                <th>كود العميل</th>
                <th>id</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => <tr key={client.id}>
                <td>
                  <NavLink to={`/clients/delete/${client.id}`} >
                    <i className='bi bi-trash text-bg-danger p-1 mx-1 rounded'></i>
                  </NavLink>
                  <NavLink to={`/clients/edite/${client.id}`} >
                    <i className='bi bi-pencil-square text-bg-primary mx-1 p-1 rounded'></i>
                  </NavLink>
                  <NavLink to={`/clients/details/${client.id}`} >
                    <i className='bi bi-list-ul text-bg-success mx-1 p-1 rounded'></i>
                  </NavLink>
                </td>
              
                <td>{client.address}</td>
                <td>{client.phones}</td>
              
                <td></td>
                <td>{client.name}</td>
                <td>{client.code}</td>
                <td>{client.id}</td>
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
  };

  return (
    <>

      <div className=" my-3 text-center ">
        <NavLink to='/clients/add' className='btn btn-primary' >إضافة عميل</NavLink>
      </div>

      {showClients()}
    </>)
}
