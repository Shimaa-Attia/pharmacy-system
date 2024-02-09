import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';


export default function AddShortComingsDoctor() {
  let { accessToken } = useContext(AuthContext);
  let formInputs = document.querySelectorAll('form input');
  let textarea = document.querySelector('form textarea');
  let [isLoading, setIsLoading] = useState(false);
  let [shortComings, setShortComings] = useState({
    productName: '',
    productImage: '',
    clientInfo: '',
    isAvailable_inOtherBranch: '',
    productType: '',
    notes: ''
  });

  let getInputValue = (event) => {
    let myShortComings = { ...shortComings }; //deep copy
    myShortComings[event?.target?.name] = event?.target?.value;
    setShortComings(myShortComings);
  };
  let handleImageChange=(e)=>{
    setShortComings({...shortComings,
    productImage:e.target.files[0]});
  }


  let sendShortComingsDataToApi = async () => {
    const shorts = new FormData();
    shorts.append('productName', shortComings.productName);
    shorts.append('clientInfo', shortComings.clientInfo);
    shorts.append('isAvailable_inOtherBranch', shortComings.isAvailable_inOtherBranch);
    shorts.append('productType', shortComings.productType);
    shorts.append('notes', shortComings.notes);
    shorts.append('productImage', shortComings?.productImage);
    await axios.post(`${process.env.REACT_APP_API_URL}/api/shortcomings`, shorts, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      toast.success(res.data.message, {
        position: 'top-center'
      });
      setIsLoading(false);
      formInputs.forEach((el) => {
        el.value = '';
      });
      textarea.value = '';
      document.getElementById("productType").selectedIndex = "0";
      document.getElementById("isAvailable_inOtherBranch").selectedIndex = "0";

    }).catch((errors) => {
      console.log(errors);
      setIsLoading(false);
      const errorList = errors?.response?.data?.message;
      if (errorList !== undefined) {
        Object.keys(errorList)?.map((err) => {
          errorList[err]?.map((err) => {
            toast.error(err);
          })
        });
      } else {
        toast.error("حدث خطأ ما");
      }
    });
  };

  let validateShortComingsForm = () => {
    const schema = Joi.object({
      productName: Joi.string().required(),
      productImage: Joi.any(),
      clientInfo: Joi.string().empty(''),
      isAvailable_inOtherBranch: Joi.required(),
      productType: Joi.string().required(),
      notes: Joi.string().empty(''),
    });
    return schema.validate(shortComings, { abortEarly: false });
  };

  let submitShortComingsForm = (e) => {
    setIsLoading(true);
    e.preventDefault();
    let validation = validateShortComingsForm();
    if (!validation.error) {
      sendShortComingsDataToApi();
      setShortComings({
        productName: '',
        productImage: '',
        clientInfo: '',
        isAvailable_inOtherBranch: '',
        productType: ''

      })
    } else {
      setIsLoading(false);
      try {
        validation?.error?.details?.map((err) => {
          toast.error(err.message);
        })
      } catch (e) {
        toast.error("حدث خطأ ما");
      }
    }
  };


  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Add Shortcomings</title>
      </Helmet>
      <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة نواقص </h3>
      <div className="mx-5 p-3 rounded rounded-3 bg-white">
        <form onSubmit={submitShortComingsForm} >
          <div className="row gy-3">
            <div className="col-md-4">
              <label htmlFor="productName" className='form-label'>اسم المنتج</label>
              <input type="text" className='form-control' name="productName" id="productName" onChange={getInputValue} />
            </div>
            <div className="col-md-4">
              <label htmlFor="productImage" className='form-label'>صورة المنتج</label>
              <input type="file" accept='image/*' className='form-control' name="productImage" id="productImage" onChange={handleImageChange} />
            </div>
            <div className="col-md-4">
              <label htmlFor="clientInfo" className='form-label'> كود أو اسم أو هاتف العميل</label>
              <input type="text" className='form-control' name="clientInfo" id="clientInfo" onChange={getInputValue} />
            </div>
            <div className="col-md-4">
              <label htmlFor="isAvailable_inOtherBranch" className='form-label'>متوفر بالفرع الآخر</label>
              <select name="isAvailable_inOtherBranch" defaultValue={0} className='form-control' id="isAvailable_inOtherBranch"
                onChange={getInputValue}>
                <option value={0} hidden disabled>اختار</option>
                <option value={1}>نعم</option>
                <option value={0}>لا</option>
          
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="productType" className='form-label'>نوع المنتج</label>
              <select name="productType" defaultValue={0} className='form-control' id="productType"
                onChange={getInputValue}>
                <option value={0} hidden disabled>اختار</option>
                <option value="أدوية">أدوية</option>
                <option value="تركيبات">تركيبات</option>
                <option value="كوزمو">كوزمو</option>
                <option value="مستلزمات طبية">مستلزمات طبية </option>
              </select>
            </div>

            <div className="col-md-12">
              <label htmlFor="notes" className='form-label'>ملاحظات</label>
              <textarea name="notes" id="notes" className='form-control' onChange={getInputValue} />
            </div>
            <div className="col-md-3">
              <button type='submit' className='btn btn-primary form-control fs-5'>
                {isLoading == true ? <i className='fa fa-spinner fa-spin'></i> : 'إضافة'}
              </button>
            </div>
          
          </div>
        </form >
      </div >
    </>
  )
}
