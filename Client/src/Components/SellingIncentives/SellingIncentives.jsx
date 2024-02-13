import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'

import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';

export default function SellingIncentives() {
    let { accessToken } = useContext(AuthContext);
    let [sellingIncentives, setSellingIncentives] = useState([]);

    let [searchText, setSearchText] = useState('');
    function handleSearchChange(event) {
        setSearchText(event.target.value);
    };
    let [filterReasonId, setFilterReasonId] = useState('');
    function handleReasonChange(event) {
        setFilterReasonId(event?.target?.value);

    }
    let getSellingIncentivesData = async () => {
        let incentiveResult;
        let urlApi = `${process.env.REACT_APP_API_URL}/api/incentives/filter?`;
        if (filterReasonId !== undefined && filterReasonId.length > 0) {
            urlApi += `incentiveReason_id=${filterReasonId}&`
        }
        if (searchText !== undefined && searchText.trim().length > 0) {
            urlApi += `key=${searchText}&`
        }

        incentiveResult = await axios.get(urlApi, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        if (incentiveResult) {
            setSellingIncentives(incentiveResult.data.data);

        }
    };
    useEffect(() => {
        getSellingIncentivesData()
    }, [searchText, filterReasonId]);

    let showSellingIncentives = () => {
        if (sellingIncentives.length > 0) {
            return (
                <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive">
                    <table dir="rtl" responsive='md' className='table table-bordered table-hover text-center align-middle table-responsive-list  '>
                        <thead className='table-primary  no-wrap-heading'>
                            <tr>
                                <th>اسم المنتج</th>
                                <th>استخدامه</th>
                                <th>التركيب</th>
                                <th>السبب</th>
                                <th>نسبة الحافز</th>
                                <th>ملاحظات</th>
                                <th>خيارات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sellingIncentives.map((incentive) => <tr key={incentive.id}>
                                <td data-label="اسم المنتج">{incentive?.productName}</td>
                                <td data-label="استخدامه">{incentive?.usage}</td>
                                <td data-label="التركيب">{incentive?.composition }</td>
                                <td data-label="السبب">{incentive?.incentiveReason?.name }</td>
                                <td data-label="نسبة الحافز">{incentive?.incentivesPercentatge }</td>
                                <td data-label="ملاحظات">{incentive?.notes }</td>
                                <td data-label="خيارات" style={{ minWidth: '90px' }}>
                                    <NavLink to={`/sellingincentives/delete/${incentive.id}`}>
                                        <i className='bi bi-trash text-bg-danger p-1 mx-1  rounded'></i>
                                    </NavLink>
                                    <NavLink to={`/sellingincentives/edite/${incentive.id}`}>
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
                    {sellingIncentives.length <= 0 && searchText.length <= 0 && filterReasonId <=0 ?
                        <i className='fa fa-spinner fa-spin  fa-5x'></i>
                        : <div className='alert alert-danger w-50 text-center'>لا يوجد منتجات</div>
                    }
                </div>
            )
        }
    };
    //get reason data
    let [reasonData, setReasonData] = useState([]);
    let getReasonData = async () => {
        let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/getCustomList/incentiveReason`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        setReasonData(data)
    }
    useEffect(() => {
        getReasonData()
    }, []);
    return (

        <>
            <>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Selling Incentive</title>
                </Helmet>
                <div className=" my-3 text-center row mx-2  " dir='rtl'>
                    <div className="col-md-12">
                        <NavLink to='/sellingincentives/add' className='btn btn-primary mb-1' >إضافة منتج </NavLink>
                    </div>
                    <div className="col-md-6">
                        <input type="text" className='form-control text-end mt-1' onChange={handleSearchChange} placeholder=' بحث...   ' />
                    </div>
                    <div className="col-md-6">
                        <select name="incentiveReason_id" className='form-control mt-1' defaultValue={0} onChange={handleReasonChange} >
                            <option value={0} hidden disabled>اختر سبب...</option>
                            {reasonData.map((reas) => <option key={reas.id} value={reas.id}>{reas?.name}</option>)}
                        </select>
                    </div>
                </div>
            </>


            {showSellingIncentives()}
        </>)
}
