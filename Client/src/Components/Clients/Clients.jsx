import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';

export default function Clients() {
    let { accessToken } = useContext(AuthContext);
    let [clients, setClients] = useState([]);

    let [searchText, setSearchText] = useState('');
    function handleSearchChange(event) {
        setSearchText(event.target.value);

    };

    let getClientData = async () => {
        let searchResult;
        if (searchText !== undefined && searchText.trim().length > 0) {
            searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/search/${searchText.trim()}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });


            setClients(searchResult.data.data);

        } else {
            searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            setClients(searchResult.data.data);


        }
    };
    useEffect(() => {
        getClientData()
    }, [searchText]);

    let showClients = () => {
        if (clients.length > 0) {
            return (
                <div className="shadow rounded rounded-4 bg-white mx-3 p-3 ">
                    <table responsive='md' className='table table-bordered table-hover text-center table-responsive-list  '>
                        <thead className='table-primary'>
                            <tr>
                                <th>خيارات</th>
                                <th>ملاحظات</th>
                                <th>العناوين</th>
                                <th>أرقام الهواتف</th>
                                <th>الاسم</th>
                                <th>كود العميل</th>
                                <th>رقم</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client, index) => <tr key={client.id}>
                                <td data-label="خيارات">
                                    <NavLink to={`/clients/delete/${client.id}`}>
                                        <i className='bi bi-trash text-bg-danger p-1 mx-1  rounded'></i>
                                    </NavLink>
                                    <NavLink to={`/clients/edite/${client.id}`}>
                                        <i className='bi bi-pencil-square text-bg-primary mx-1 p-1 rounded'></i>
                                    </NavLink>
                                    <NavLink to={`/clients/details/${client.id}`}>
                                        <i className='bi bi-list-ul text-bg-success mx-1 p-1 rounded'></i>
                                    </NavLink>
                                </td>

                               
                                <td data-label="العناوين">
                                    {client?.contactInfo?.map((contactInfo) => {
                                        if (contactInfo.name === "address") {
                                            return <p key={contactInfo.id}>{contactInfo.value}</p>
                                        }
                                    })}
                                </td>
                                <td data-label="أرقام الهواتف">
                                    {client?.contactInfo?.map((contactInfo) => {
                                        if (contactInfo.name === "phone") {
                                            return <p key={contactInfo.id}>{contactInfo.value}</p>
                                        }
                                    })}
                                </td>


                                <td data-label="اسم العميل">{client.name}</td>
                                <td data-label="كود العميل">{client.code}</td>
                                <td data-label="#">{++index}</td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return (
                <div className=' d-flex justify-content-center height-calc-70 align-items-center'>
                    <i className='fa fa-spinner fa-spin fa-5x'></i>
                </div>)
        }
    };

    return (

        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Clients</title>
            </Helmet>
            <div className=" my-3 text-center row mx-2  ">
                <div className="col-md-6">
                    <NavLink to='/clients/add' className='btn btn-primary mb-1'>إضافة عميل</NavLink>
                </div>
                <div className="col-md-4">
                    <input type="text" className='form-control text-end mt-1' onChange={handleSearchChange} placeholder=' ...بحث عن عميل ' />
                </div>
            </div>


            {showClients()}
        </>)
}
