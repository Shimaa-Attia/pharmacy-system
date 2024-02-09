
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';


export default function DeleteOffer() {
    let { accessToken } = useContext(AuthContext);
    let { id } = useParams();
    let navigate = useNavigate();
 

    let [offer, setOffer] = useState([]);
    let getOffer = async () => {
        try {
            let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/offers/show/${id}`,{
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                  }
            });
            console.log(data);
            setOffer(data);

        } catch (error) {
            toast.error('حدث خطأ ما، حاول مرة أخرى')
        }

    };
    useEffect(() => { getOffer() }, []);
    let deleteOffer = async () => {
        try {
     let {data} = await axios.delete(`${process.env.REACT_APP_API_URL}/api/offers/delete/${id}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            navigate('/offers')
            toast.success(data.message);

        } catch (error) {
            toast.error('حدث خطأ ما، حاول مرة أخرى')

        }

    };



    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Delete Offer</title>
            </Helmet>
            <h4 className='alert alert-primary m-3 text-center' >هل أنت متأكد من حذف هذا العرض؟</h4>
            <div className="card m-auto w-50 p-3">
                <div className="card-body  ">
                    <h4 className="card-title  "> اسم المنتج : {offer?.productName}</h4>
                    <h5 className='my-3'> العرض: {offer?.offer}</h5>
                    <h5 className='my-3'> تاريخ انتهاء العرض : {offer?.offer_endDate}</h5>
                    <h5> ملاحظات  : {offer?.notes}</h5>

                </div>
            </div>

            <div className="col-md-3 d-flex m-auto mt-3 ">
                <NavLink to='../offers' className='btn  btn-secondary form-control mx-2 '>رجوع</NavLink>
                <button className='btn btn-danger form-control mx-2' onClick={deleteOffer} >حذف العرض</button>
            </div>


        </>
    )
}
