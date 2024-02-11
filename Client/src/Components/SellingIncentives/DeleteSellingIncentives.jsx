
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';


export default function DeleteSellingIncentives() {
    let { accessToken } = useContext(AuthContext);
    let { id } = useParams();
    let navigate = useNavigate();
 

    let [oneIncentive, setOneIncentive] = useState([]);
    let getoneIncentive = async () => {
        try {
            let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/incentives/show/${id}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setOneIncentive(data.data);
        } catch (error) {
            toast.error('حدث خطأ ما، حاول مرة أخرى')
        }

    };
    useEffect(() => { getoneIncentive() }, []);
    let deleteIncentives = async () => {
        try {
         let {data}= await  axios.delete(`${process.env.REACT_APP_API_URL}/api/incentives/delete/${id}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            navigate('/sellingincentives')
            toast.success(data.message);

        } catch (error) {
            toast.error('حدث خطأ ما، حاول مرة أخرى')

        }

    };



    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Delete Incentive</title>
            </Helmet>
            <h4 className='alert alert-primary m-3 text-center' >هل أنت متأكد من حذف هذا المنتج؟</h4>
            <div className="card m-auto w-50 p-3">
                <div className="card-body  ">
                    <p className="card-title fs-4 "> اسم المنتج : {oneIncentive?.productName}</p>
                    <p className="card-title fs-4 ">  استخدامه : {oneIncentive?.usage}</p>
                    <p className="card-title fs-4 "> تركيب المنتج : {oneIncentive?.composition}</p>
                    <p className="card-title fs-4 "> السببب  : {oneIncentive?.incentiveReason?.name}</p>
                    <p className="card-title fs-4 "> نسبة حافز البيع   : {oneIncentive?.incentivesPercentatge}</p>
                    <p className="card-title fs-4 "> ملاحظات  : {oneIncentive?.notes}</p>
                  
                  

                </div>
            </div>

            <div className="col-md-3 d-flex m-auto mt-3 ">
         
                <button className='btn btn-danger form-control mx-2' onClick={deleteIncentives} >حذف المنتج</button>
            </div>


        </>
    )
}
