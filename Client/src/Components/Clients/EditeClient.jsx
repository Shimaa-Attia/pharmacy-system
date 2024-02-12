import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Field, Form, Formik } from "formik";
import { Helmet } from 'react-helmet';
import { AuthContext } from '../../Context/AuthStore';

export default function EditeClient() {
  let { accessToken } = useContext(AuthContext);
  let [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  let { id } = useParams();
  let [clients, setClients] = useState({
    code: '',
    name: '',
    phones: [],
    addresses: [],
    onHim: '',
    forHim: '',
    notes: ''
  });

  let getOneClient = async () => {
    try {
      let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/show/${id}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      let phones = data?.data?.contactInfo.filter((item) => item.name === 'phone');
      let addresses = data?.data?.contactInfo.filter((item) => item.name === 'address');

      setClients({
        code: data?.data?.code,
        name: data?.data?.name,
        phones: phones.map(phone => phone.value), // Extracting values from objects
        addresses: addresses.map(address => address.value), // Extracting values from objects
        onHim: data?.data?.onHim,
        forHim: data?.data?.forHim,
        notes: data?.data?.notes
      });
      console.log(clients);
    } catch (error) {
      toast.error('حدث خطأ ما، حاول مرة أخرى')
    }

  };

  useEffect(() => {
    getOneClient()

  }, []);

  let getInputValue = (event) => {
    const { name, value } = event.target;
    let myClients = { ...clients }; // deep copy
    if (name === "phones" || name === "addresses") {
      // If the input is for phones or addresses, split the value by comma and trim each value
      myClients[name] = [value];
    } else {
      // Otherwise, update the value normally
      myClients[name] = value;
    }
    console.log(myClients);
    setClients(myClients);
  };
  let sendEditedDataToApi = async () => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/customers/${id}`, clients, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      toast.success(res.data.message, {
        position: 'top-center'
      });
      setIsLoading(false);
      // navigate('../clients');


    }).catch((errors) => {
      console.log(errors);
      setIsLoading(false);
      try {
        const errorList = errors?.response?.data?.message;
        if (errorList !== undefined) {
          Object.keys(errorList).map((err) => {
            errorList[err].map((err) => {
              toast.error(err);
            })
          });
        }
      } catch (error) {
        toast.error('حدث خطأ ما')
      }
    });
  };
  let validateClientForm = () => {
    const schema = Joi.object({
      name: Joi.string().empty(''),
      code: Joi.string().required(),
      phones: Joi.any().empty(null), 
      addresses: Joi.any().empty(null),
      onHim: Joi.number().empty(null),
      forHim: Joi.number().empty(null),
      notes: Joi.any().empty(''),

    });
    return schema.validate(clients, { abortEarly: false });
  };
  let submitEditedClient = (e) => {
    e.preventDefault();
    setIsLoading(true);
    let validation = validateClientForm();
    if (!validation.error) {
      sendEditedDataToApi();
    } else {
      setIsLoading(false);
      try {
        validation.error.details.map((err) => {
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
        <title>Edite Client</title>
      </Helmet>
      <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'> تعديل بيانات ({clients?.name}) </h3>
      <div className="mx-5 p-3 rounded rounded-3 bg-white">


        <form onSubmit={submitEditedClient}>
          <div className="row g-3" >

            <div className="col-md-6">
              <label htmlFor="code" className='form-label'>كود العميل</label>
              <input type="text" className='form-control' name="code" id="code" 
              defaultValue={clients?.code}
              onChange={getInputValue} />
            </div>
            <div className="col-md-6">
              <label htmlFor="name" className='form-label'>الاسم</label>
              <input type="text" className='form-control' name="name" id="name" 
              defaultValue={clients?.name}
              onChange={getInputValue}/>
            </div>
            <div className="col-md-6">
              <label htmlFor="phone1" className='form-label'> رقم هاتف</label>
              <input type="tel" className='form-control phone' name="phones" 
               defaultValue={clients?.phones}
               onChange={getInputValue} />
            </div>

            <div className="col-md-6">
              <label htmlFor="addresses1" className='form-label'> عنوان</label>
              <input type="text" className='form-control address' name="addresses"
                defaultValue={clients?.addresses}
                onChange={getInputValue} />
            </div>

            <div className="col-md-6">
              <label htmlFor="onHim" className='form-label'>عليه</label>
              <input type="text" className='form-control' name="onHim" id="onHim" 
               defaultValue={clients?.onHim} 
               onChange={getInputValue}/>
            </div>
            <div className="col-md-6">
              <label htmlFor="forHim" className='form-label'>له</label>
              <input type="text" className='form-control' name="forHim" id="forHim" 
               defaultValue={clients?.forHim}
               onChange={getInputValue} />
            </div>
            <div className="col-md-12">
              <label htmlFor="notes" className='form-label'>ملاحظات</label>
              <textarea type="text" className='form-control' name="notes" id="notes" 
                 defaultValue={clients?.notes}
               onChange={getInputValue}/>
            </div>
            <div className="col-md-3">
              <button type='submit' className='btn btn-primary form-control fs-5'>
                {isLoading == true ?
                  <i className='fa fa-spinner fa-spin'></i> : 'تعديل'}
              </button>
            </div>
          </div>
       
        </form>

      </div>


    </>
  )
}
