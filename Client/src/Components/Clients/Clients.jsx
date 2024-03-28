import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'

import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';
import Pagination from '../Pagination/Pagination';
import { toast } from 'react-toastify';

export default function Clients() {
    let { accessToken } = useContext(AuthContext);
    let [clients, setClients] = useState([]);
    let [pagination, setPagination] = useState(null);
    let [currentPage, setCurrentPage] = useState(1); // Current page state
    let [searchText, setSearchText] = useState('');
    function handleSearchChange(event) {
        setSearchText(event.target.value);

    };

    let getClientData = async (page = 1) => {
        let searchResult;
        if (searchText !== undefined && searchText.trim().length > 0) {
            searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/search/${searchText.trim()}?page=${page}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
          
            setClients(searchResult.data.data);
            setPagination(searchResult.data.meta); // Set pagination data
            setCurrentPage(page); // Set current page
        } else {
            searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers?page=${page}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });     
            setClients(searchResult.data.data);
            setPagination(searchResult.data.meta); // Set pagination data
            setCurrentPage(page); // Set current page
        }
    };
    useEffect(() => {
        getClientData()
    }, [searchText])
    //for handle page change
    let handlePageChange = (page) => {
        getClientData(page);
    };

    //for making checkBox for every one
    let sendUpdateCheckBoxToApi = async (custId) => {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/customers/updateCheckBox/${custId}`, {}, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((res) => {
            toast.success(res.data.message);
            getClientData()
        }).catch((errors) => {
            toast.error('حدث خطأ ما');
            toast.error(errors?.response?.data?.message);
        })
    }
    //for making reset all checkBox
    let sendResetCheckBoxToApi = async () => {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/customers/updateCheckBox/all`, {}, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((res) => {
            toast.success(res.data.message);
            getClientData()
        }).catch((errors) => {
            toast.error('حدث خطأ ما');
            toast.error(errors?.response?.data?.message);
        })
    }

    let showClients = () => {
        if (clients.length > 0) {
            return (
                <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive ">
                    <div  style={{ cursor: 'pointer' }} onClick={sendResetCheckBoxToApi} className='bg-danger text-white w-75 text-center m-auto d-block d-sm-none p-1 rounded'>عدم تحديد الكل</div>

                    <table dir="rtl" className='table  table-hover align-middle text-center table-responsive-list  '>
                        <thead className='table-primary   no-wrap-heading'>
                            <tr>
                                <th>رقم</th>
                                <th>كود العميل</th>
                                <th>الاسم</th>
                                <th>المنطقة الإفتراضية</th>
                                <th>المناطق الأخرى </th>
                                <th>أرقام الهواتف</th>
                                {/* <th>العناوين</th> */}
                                <th>له</th>
                                <th>عليه</th>
                                <th>خيارات</th>
                                <th>
                                    <div style={{ cursor: 'pointer' }} onClick={sendResetCheckBoxToApi} className='bg-danger text-white p-1 rounded'>عدم تحديد الكل</div>

                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client, index) => <tr key={client.id}>
                                <td data-label="#">{++index}</td>
                                <td data-label="كود العميل">{client?.code}</td>
                                <td data-label="اسم العميل">{client?.name}</td>
                                <td data-label=" المنطقة الإفتراضية">{client?.defaultArea?.name}</td>
                                <td data-label="المناطق الأخرى">
                                    {client?.areas?.map((area) => (<div key={area.id}>

                                        <p >{area.name}</p>
                                    </div>
                                    )
                                    )}
                                </td>
                                <td data-label="أرقام الهواتف">
                                    {client?.contactInfo?.map((contactInfo) => {
                                        if (contactInfo.name === "phone") {
                                            return <p key={contactInfo.id}>{contactInfo.value}</p>
                                        }
                                    })}
                                </td>
                                {/* <td data-label="العناوين">
                                    {client?.contactInfo?.map((contactInfo) => {
                                        if (contactInfo.name === "address") {
                                            return <p key={contactInfo.id}>{contactInfo.value}</p>
                                        }
                                    })}
                                </td> */}
                                <td data-label="له">{client?.forHim}</td>
                                <td data-label="عليه">{client?.onHim}</td>
                                <td data-label="خيارات" >
                                    <NavLink to={`/clients/delete/${client.id}`}>
                                        <i className='bi bi-trash text-danger fs-5 p-1'></i>
                                    </NavLink>
                                    <NavLink to={`/clients/edite/${client.id}`}>
                                        <i className='bi bi-pencil-square text-primary p-1 fs-5'></i>
                                    </NavLink>
                                    <NavLink to={`/clients/details/${client.id}`}>
                                        <i className='bi bi-list-ul text-success fs-5 p-1'></i>
                                    </NavLink>
                                </td>
                                <td >
                                    {client.checkBox ? <i className='bi bi-check-circle-fill text-success fs-5'
                                        onClick={() => sendUpdateCheckBoxToApi(client.id)} ></i>
                                        : <i className='bi bi-x-circle-fill text-danger fs-5 '
                                            onClick={() => sendUpdateCheckBoxToApi(client.id)} ></i>}
                                </td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return (
                <div className=' d-flex justify-content-center  height-calc-70 align-items-center' >
                    {clients.length <= 0 && searchText.length <= 0  ?
                        <i className='fa fa-spinner fa-spin  fa-5x'></i>
                        : <div className='alert alert-danger w-50 text-center'>لا يوجد تطابق لهذا البحث</div>
                    }
                </div> 
                )
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

            <div className="text-center mb-2">
                <Pagination pagination={pagination} currentPage={currentPage} handlePageChange={handlePageChange} />
            </div>
            {showClients()}
        </>)
}
