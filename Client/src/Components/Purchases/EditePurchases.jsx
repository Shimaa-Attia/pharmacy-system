import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';


export default function EditePurchases() {
  let { accessToken } = useContext(AuthContext);
  let { id } = useParams()
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
  let handleImageChange = (e) => {
    setShortComings({
      ...shortComings,
      productImage: e.target.files[0]
    });
  }
  let [purchasesData, setPurchasesData] = useState([]);
  let getPurchasesData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/shortcomings/show/${id}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setPurchasesData(data.data)
    setShortComings({
      productName: data?.data?.productName,
      clientInfo: data?.data?.clientInfo,
      isAvailable_inOtherBranch: data?.data?.isAvailable_inOtherBranch,
      productType: data?.data?.productType,
      notes: data?.data?.notes
    })
  }
  useEffect(() => {
    getPurchasesData()
  }, []);

  let sendEditedShortComingsDataToApi = async () => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/shortcomings/${id}`, shortComings, {
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

  let validateEditedShortComingsForm = () => {
    const schema = Joi.object({
      productName:Joi.string().required(),
      productImage:Joi.any(),
      clientInfo:Joi.any(),
      isAvailable_inOtherBranch: Joi.any().empty(null),
      productType:Joi.string().empty(null),
      notes:Joi.any().empty(''),
    });
    return schema.validate(shortComings, { abortEarly: false });
  };

  let submitEditedShortComingsForm = (e) => {
    setIsLoading(true);
    e.preventDefault();
    let validation = validateEditedShortComingsForm();
    if (!validation.error) {
      sendEditedShortComingsDataToApi();
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
        <title>Edite Shortcomings</title>
      </Helmet>
      <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'> تعديل </h3>
      <div className="mx-5 p-3 rounded rounded-3 bg-white">
        <form onSubmit={submitEditedShortComingsForm} >
          <div className="row gy-3">
            <div className="col-md-4">
              <label htmlFor="productName" className='form-label'>اسم المنتج</label>
              <input type="text" className='form-control' name="productName" id="productName"
                defaultValue={purchasesData?.productName}
                onChange={getInputValue} />
            </div>
            {/* <div className="col-md-4">
              <label htmlFor="productImage" className='form-label'>صورة المنتج</label>
              <input type="file" accept='image/*' className='form-control' name="productImage" id="productImage" 
              onChange={handleImageChange} />
            </div> */}
            <div className="col-md-4">
              <label htmlFor="clientInfo" className='form-label'> كود أو اسم أو هاتف العميل</label>
              <input type="text" className='form-control' name="clientInfo" id="clientInfo"
                defaultValue={purchasesData?.clientInfo}
                onChange={getInputValue} />
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
              <select name="productType" className='form-control' id="productType"
                defaultValue={0}

                onChange={getInputValue}>
                <option value={0} hidden disabled>اختار</option>
                <option value="أدوية" >أدوية</option>
                <option value="تركيبات">تركيبات</option>
                <option value="كوزمو">كوزمو</option>
                <option value="مستلزمات طبية">مستلزمات طبية </option>
              </select>
        

            </div>

            <div className="col-md-12">
              <label htmlFor="notes" className='form-label'>ملاحظات</label>
              <textarea name="notes" id="notes" defaultValue={purchasesData?.notes} className='form-control' onChange={getInputValue} />
            </div>
            <div className="col-md-3">
              <button type='submit' className='btn btn-primary form-control fs-5'>
                {isLoading == true ? <i className='fa fa-spinner fa-spin'></i> : 'تعديل'}
              </button>
            </div>
          </div>
        </form >
      </div >
    </>
  )
}
