import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/AuthStore';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';

export default function PurchasesDeatils() {
  let { accessToken } = useContext(AuthContext);
  let [purchasesData, setPurchasesData] = useState([]);
  let { id } = useParams();

  let getPurchasesDetails = async () => {
    try {
      let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/shortcomings/show/${id}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      setPurchasesData(data.data);

    } catch (error) {
      toast.error('حدث خطأ ما، حاول مرة أخرى')

    }
  };
  useEffect(() => {
    getPurchasesDetails()
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title> purchases Details</title>
      </Helmet>
      <h4 className='text-center alert alert-primary m-3 '>({purchasesData?.productName})</h4>
      <div className="col-md-2 m-auto ">
        <NavLink to='/purchases' className='btn  btn-secondary form-control mx-2 '>رجوع</NavLink>
      </div>
      <div className="card mx-3 m-auto my-3 p-5 ">
        <div className="row  ">
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 mt-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h2 > اسم المنتج : {purchasesData?.productName} </h2>
            </div>
          </div>
          <div className='col-md-6 '>
            <div className="text-center rounded p-2 mt-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3  >نوع المنتج: {purchasesData?.productType}</h3>
            </div>
          </div>

          <div className='col-md-6 ' >
            <div className="text-center rounded p-2 my-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }}>
              <h4 className='h3'> بيانات العميل : {purchasesData?.clientInfo}</h4>
            </div>
          </div>
          <div className='col-md-6 ' >
            <div className="text-center rounded p-2 my-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }}>
              <h5 className='h3' > فرع الموظف: {purchasesData?.branch?.name}</h5>
            </div>
          </div>
          <div className='col-md-6 ' >
            <div className="text-center rounded p-2 my-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }}>
              <h5 className='h3' > اسم الموظف : {purchasesData?.creatorUser?.name}</h5>
            </div>
          </div>
          <div className='col-md-6 ' >
            <div className="text-center rounded p-2 my-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }}>
              <h5 className='h3' > وظيفته: {purchasesData?.creatorUser?.role}</h5>
            </div>
          </div>
          <div className='col-md-6 ' >
            <div className="text-center rounded p-2 my-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }}>
              <h5 className='h3' > حالة المنتج: {purchasesData?.status?.name}</h5>
            </div>
          </div>
          <div className='col-md-6 ' >
            <div className="text-center rounded p-2 my-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }}>
              <h5 className='h3' >  متوفر بالفرع الأخر : {purchasesData?.isAvailable_inOtherBranch == 1 ? "متوفر" : "غير متوفر"}</h5>
            </div>
          </div>
          <div className='col-md-12' >
            <div className="text-center rounded p-2 my-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }}>
              <h5 className='h3' > آخر تعديل للحالة: {purchasesData?.updaterUser?.name}</h5>
            </div>
          </div>
          <div className='col-md-12 ' >
            <div className="text-center rounded p-2 my-2" style={{ backgroundColor: ' rgb(160, 200, 240)' }}>
              <h5 className='h3' > ملاحظات : {purchasesData?.notes}</h5>
            </div>
          </div>
          <div className='col-md-6 ' >
            <div className="text-center rounded p-2 my-2" >
              <img src={purchasesData.imageName} className='w-50' alt="صورة المنتج" />
            </div>
          </div>

 

        </div>

      </div>


    </>
  )
}
