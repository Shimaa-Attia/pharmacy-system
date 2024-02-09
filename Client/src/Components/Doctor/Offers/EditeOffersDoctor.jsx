

import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../Context/AuthStore';
import EditeOffer from '../../Offers/EditeOffer';

export default function EditeOffersDoctor() {
  let { accessToken } = useContext(AuthContext);
  let { id } = useParams();
  let [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
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
        navigate('/doctorlayout/doctoroffers')
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
      offer: Joi.any().empty(''),
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
      <EditeOffer/>
    </>
  )
}

