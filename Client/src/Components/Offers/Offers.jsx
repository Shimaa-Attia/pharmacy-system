
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'

import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';

export default function Offers() {
    let { accessToken } = useContext(AuthContext);
    let [offers, setOffers] = useState([]);

    let [searchText, setSearchText] = useState('');
    function handleSearchChange(event) {
        setSearchText(event.target.value);

    };

    let getOffersData = async () => {
        let searchResult;
        if (searchText !== undefined && searchText.trim().length > 0) {
            searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/offers/search/${searchText.trim()}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setOffers(searchResult.data);

        } else {
            searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/offers`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            setOffers(searchResult.data);
   
        }
    };
    useEffect(() => {
        getOffersData()
    }, [searchText]);

    let showOffers = () => {
        if (offers.length > 0) {
            return (
                <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive">
                    <table dir="rtl" responsive='md' className='table table-bordered table-hover text-center align-middle table-responsive-list  '>
                        <thead className='table-primary  no-wrap-heading'>
                            <tr>
                                <th>اسم المنتج</th>
                                <th>العرض</th>
                                <th>تاريخ انتهاء العرض</th>
                                <th>ملاحظات</th>
                                <th>خيارات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers.map((off) => <tr key={off.id}>
                                <td data-label="اسم المنتج">{off?.productName}</td>
                                <td data-label="العرض">{off?.offer ? off?.offer : '...'}</td>
                                <td data-label="تاريخ انتهاء العرض">{off?.offer_endDate ? off?.offer_endDate : '...'}</td>
                                <td data-label="ملاحظات">{off?.notes ? off.notes : '...'}</td>
                                <td data-label="خيارات" style={{ minWidth: '90px' }}>
                                    <NavLink to={`/offers/delete/${off.id}`}>
                                        <i className='bi bi-trash text-bg-danger p-1 mx-1  rounded'></i>
                                    </NavLink>
                                    <NavLink to={`/offers/edite/${off.id}`}>
                                        <i className='bi bi-pencil-square text-bg-primary mx-1 p-1 rounded'></i>
                                    </NavLink>

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
                {offers.length <= 0 && searchText.length <= 0  ?
                 <i className='fa fa-spinner fa-spin  fa-5x'></i>
                  : <div className='alert alert-danger w-50 text-center'>لا يوجد عروض</div>
               }
             </div>
                )
        }
    };

    return (

        <>
           <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Offers</title>
            </Helmet>
            <div className=" my-3 text-center row mx-2  ">
                <div className="col-md-6">
                    <NavLink to='/offers/add' className='btn btn-primary mb-1' >إضافة عرض</NavLink>
                </div>
                <div className="col-md-4">
                    <input type="text" className='form-control text-end mt-1' onChange={handleSearchChange}  placeholder=' ...بحث عن عرض ' />
                </div>
            </div>
        </>


            {showOffers()}
        </>)
}
