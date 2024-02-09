

import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';

export default function EditeOffer() {
  let { accessToken } = useContext(AuthContext);
  let { id } = useParams();
  let [isLoading, setIsLoading] = useState(false);
  let [offers, setOffers] = useState({
    productName: '',
    offer: '',
    offer_endDate: '',
    notes: ''
  });
  //getting data for one offer
  let [oneOffer, setOneOffer] = useState([]);
  let getOffer = async () => {
    try {
      let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/offers/show/${id}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setOneOffer(data);
      setOffers({
        productName: data?.productName,
        offer: data?.offer,
        offer_endDate: data?.offer_endDate,
        notes: data?.notes
      })

    } catch (error) {
      toast.error('حدث خطأ ما، حاول مرة أخرى')
    }

  };
  useEffect(() => { getOffer() }, []);
  //get the values of input and put them in the offers state
  let getInputValue = (event) => {
    let myOffers = { ...offers }; //deep copy
    myOffers[event.target.name] = event.target.value;
    setOffers(myOffers);
  };
  let sendEditedOfferDataToApi = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/offers/${id}`, offers, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      }).then((res) => {
        toast.success(res.data.message, {
          position: 'top-center'
        });
        setIsLoading(false);
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
    } catch (error) {
      toast.error("حدث خطأ ما");
    }
  };

  let validateEditedOfferForm = () => {
    const schema = Joi.object({
      productName: Joi.string().required().messages({
        'string.empty': 'اسم المنتج  مطلوب',
        'any.required': 'اسم المنتج  مطلوب',
      }),
      offer: Joi.any().empty(null),
      offer_endDate: Joi.any().empty(null),
      notes: Joi.any().empty(null),
    });
    return schema.validate(offers, { abortEarly: false });
  };
  let submitEditedOfferForm = (e) => {
    setIsLoading(true);
    e.preventDefault();
    let validation = validateEditedOfferForm();
    if (!validation.error) {
      sendEditedOfferDataToApi();
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
        <title>Add Offer</title>
      </Helmet>
      <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>تعديل العرض</h3>
      <div className="mx-5 p-3 rounded rounded-3 bg-white">
        <form onSubmit={submitEditedOfferForm} >
          <div className="row gy-3">
            <div className="col-md-4">
              <label htmlFor="productName" className='form-label'>اسم المنتج </label>
              <input type="text" className='form-control' name="productName"
              defaultValue={oneOffer?.productName}
                onChange={getInputValue} />
            </div>
            <div className="col-md-4">
              <label htmlFor="offer" className='form-label'>العرض</label>
              <input type="text" className='form-control' name="offer"
                    defaultValue={oneOffer?.offer}
                onChange={getInputValue} />
            </div>
            <div className="col-md-4">
              <label htmlFor="offer_endDate" className='form-label'>تاريخ انتهاء العرض</label>
              <input type="date" className='form-control' name="offer_endDate"
                    defaultValue={oneOffer?.offer_endDate}
                onChange={getInputValue} />
            </div>
            <div className="col-md-12">
              <label htmlFor="notes" className='form-label'>ملاحظات</label>
              <textarea name="notes" id="notes" className='form-control'
                     defaultValue={oneOffer?.notes}
                onChange={getInputValue} />
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
