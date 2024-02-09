
import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';
import EditePurchases from '../Purchases/EditePurchases';


export default function EditePurchasesDoctor() {
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
      isAvailable_inOtherBranch: Joi.required(),
      productType:Joi.string().required(),
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
      <EditePurchases/>
    </>
  )
}
