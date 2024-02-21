
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';
import { toast } from 'react-toastify';

export default function Notifications() {
    let { accessToken } = useContext(AuthContext);
    let [notDoneNotifications, setNotDoneNotifications] = useState([]);

    let [filterNotDoneBranchId, setFilterNotDoneBranchId] = useState('');
    function handleNotDoneBranchChange(event) {
        setFilterNotDoneBranchId(event?.target?.value)
    }
    let [filterDoneBranchId, setFilterDoneBranchId] = useState('');
    function handleDoneBranchChange(event) {
        setFilterDoneBranchId(event?.target?.value)
    }

    let getNotDoneNotificationsData = async () => {
        let notDoneResult;
        let urlApi = `${process.env.REACT_APP_API_URL}/api/notifications/notDone/filter?`
        if (filterNotDoneBranchId !== undefined && filterNotDoneBranchId.length > 0) {
            urlApi += `branch_id=${filterNotDoneBranchId}&`
        }
        notDoneResult = await axios.get(urlApi, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        setNotDoneNotifications(notDoneResult.data);
    };
    useEffect(() => {
        getNotDoneNotificationsData()
    }, [filterNotDoneBranchId]);
    let [branches, setBranches] = useState([]);
    let getBranches = async () => {
        let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/getCustomList/branch`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        setBranches(data)
    }
    useEffect(() => {
        getBranches()
    }, []);
    let [notiStatus, setNotiStatus] = useState({
        status_id: 'change'
    })
    let sendNotificationStatusToApi = async (notId) => {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/notifications/${notId}`, notiStatus, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((res) => {
            getDoneNotificationsData()
            getNotDoneNotificationsData()
        }).catch((errors) => {
            toast.error('حدث خطأ ما');
            toast.error(errors?.response?.data?.message);
        })
    }

    let showNotDoneNotifications = () => {
        if (notDoneNotifications.length > 0) {
            return (
                <div className="shadow rounded rounded-4 bg-white m-2 p-3 table-responsive">
                    <table dir="rtl" responsive='md' className='table  table-hover  align-middle table-responsive-list  '>

                        <tbody>
                            {notDoneNotifications.map((noti) => <tr key={noti.id}>
                                <td >{noti?.body}</td>
                                <td >{noti?.branch?.name}</td>
                                <td style={{ width: '20px' }} >
                                    <div className='text-center' >
                                        <i className='bi bi-arrow-left-circle-fill text-success fs-4'
                                            onClick={() => sendNotificationStatusToApi(noti.id)} ></i>

                                    </div>
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
                    <div className='alert alert-danger w-50 text-center'>لا يوجد </div>
                </div>
            )
        }
    };
    let [doneNotifications, setDoneNotifications] = useState([]);

    let getDoneNotificationsData = async () => {
        let doneResult;
        let urlApi = `${process.env.REACT_APP_API_URL}/api/notifications/done/filter?`
        if (filterDoneBranchId !== undefined && filterDoneBranchId.length > 0) {
            urlApi += `branch_id=${filterDoneBranchId}&`
        }
        doneResult = await axios.get(urlApi, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        setDoneNotifications(doneResult.data)
    };
    useEffect(() => {
        getDoneNotificationsData()
    }, [filterDoneBranchId]);

    //delete notifaction
    let deleteNotifaction = async (notifyId) => {
        try {
            let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/api/notifications/forceDelete/${notifyId}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            toast.success(data.message);
            getDoneNotificationsData()
        } catch (error) {

            toast.error('حدث خطأ ما، حاول مرة أخرى')
        }
    };

    let showDoneNotifications = () => {
        if (doneNotifications.length > 0) {
            return (
                <div className="shadow rounded rounded-4 bg-white m-2 p-3 table-responsive">
                    <table dir="rtl" responsive='md' className='table  table-hover  align-middle table-responsive-list  '>

                        <tbody>
                            {doneNotifications.map((noti) => <tr key={noti.id}>
                                <td style={{ width: '20px' }}  >
                                    <div className='text-center' >
                                        <i className='bi  bi-arrow-right-circle-fill text-warning fs-4'
                                            onClick={() => sendNotificationStatusToApi(noti.id)} ></i>

                                    </div>
                                </td>
                                <td>{noti?.body}</td>
                                <td >{noti?.branch?.name}</td>
                                <td >
                                    <i className='bi bi-trash text-danger fs-5' onClick={() => deleteNotifaction(noti.id)}></i>
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
                    <div className='alert alert-danger w-50 text-center'>لا يوجد </div>
                </div>
            )
        }
    };

    return (


        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Notifications</title>
            </Helmet>

            <div className=" m-4">
                <NavLink to='/notifications/add' className='btn btn-primary mb-1' >إضافة إشعار</NavLink>
            </div>
            <div className='row  ' dir='rtl'>

                {/*filter not done noti */}
                <div className="col-md-4 m-auto   mb-2">
                    <select name="branch_id" defaultValue={0} className='form-control' id="branch_id"
                        onChange={handleNotDoneBranchChange}>
                        <option value={0} hidden disabled>اختر الفرع...</option>
                        {branches.map((branch) => <option key={branch.id} value={branch?.id}>{branch?.name}</option>)}
                    </select>
                </div>
                {/* filter done noti */}
                <div className="col-md-4 m-auto mb-2">
                    <select name="branch_id" defaultValue={0} className='form-control' id="branch_id"
                        onChange={handleDoneBranchChange}>
                        <option value={0} hidden disabled>اختر الفرع...</option>
                        {branches.map((branch) => <option key={branch.id} value={branch?.id}>{branch?.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="row" dir='rtl'>
                <div className="col-md-6">
                    <p className='text-center bg-warning p-1 me-2 rounded fs-5 fw-bold'>إشعارات غير منفذة</p>

                    {showNotDoneNotifications()}
                </div>

                <div className="col-md-6">
                    <p className='text-center bg-success p-1 ms-2 rounded fs-5 fw-bold'>إشعارات  منفذة</p>

                    {showDoneNotifications()}
                </div>
            </div>



        </>



    )
}
