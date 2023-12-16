import axios from 'axios';
import Joi from 'joi';
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {Form, Formik} from "formik";
import { Helmet } from 'react-helmet';

export default function EditeClient() {
  let accessToken = localStorage.getItem('userToken');
  let [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  let { id } = useParams();
  let [clients, setClients] = useState([]);
  let [contactInfo, setContactInfo] = useState([]);
  let getClient = async () => {
    try {
      let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/show/${id}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setClients(data.data);
      setContactInfo(data.data.contactInfo);
      
    } catch (error) {
      toast.error('حدث خطأ ما، حاول مرة أخرى')
    }
 
 
    
  };

  useEffect(() => {
    getClient()
  }, []);
  


  let sendEditedDataToApi = async (values) => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/customers/${id}`, values, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      console.log(res.data.message);
      toast.success(res.data.message, {
        position: 'top-center'
      });
      setIsLoading(false);
      navigate('../clients');


    }).catch((errors) => {
      setIsLoading(false);
      const errorList = errors?.response?.data?.msg;
      if (errorList !== undefined) {
        Object.keys(errorList).map((err) => {
          errorList[err].map((err) => {
            toast.error(err);
          })
        });
      } else {
        toast.error(" حدث خطأ ما ، حاول مرة أخرى  ");
      }
    });
  };
  let validateClientForm = (values) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(20).required(),
      code: Joi.string().required(),
      phones: Joi.required(),
      addresses: Joi.required(),
      notes: Joi.string().empty(''),

    });
    return schema.validate(values, { abortEarly: false });
  };
  let editeClientSubmit = (values) => {
    setIsLoading(true);
    let validation = validateClientForm(values);
    if (!validation.error) {
      sendEditedDataToApi(values);
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

        <Formik
      
        initialValues={
          {
            code: '',
            name: '',
            phones: [],
            addresses: [],
            notes: ''
          }
        } onSubmit={(values) => {
          editeClientSubmit(values)
        }}>
          {
            formik => {
              return (
                <Form className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="code" className='form-label'>كود العميل</label>
                    <input type="text" className='form-control' name="code" id="code"
                      onChange={formik.handleChange} value={clients?.code}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="name" className='form-label'>الاسم</label>
                    <input type="text" className='form-control' name="name" id="name"
                      onChange={formik.handleChange} 
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone1" className='form-label'> رقم هاتف</label>
                    <input type="tel" className='form-control phone' name="phones[0]"
                      id="phone1"  
                     
                   
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone2" className='form-label'> رقم هاتف 2 </label>
                    <input type="tel" className='form-control phone ' name="phones[1]"
                      id="phone2"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="addresses1" className='form-label'> العنوان</label>
                    <input type="text" className='form-control address' name="addresses[0]"
                      id="addresses1" 
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="addresses2" className='form-label'> 2العنوان</label>
                    <input type="text" className='form-control address' name="addresses[1]"
                      id="addresses2"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="notes" className='form-label'>ملاحظات</label>
                    <textarea name="notes" id="notes" className='form-control'
                   
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <button type='submit' className='btn btn-primary form-control fs-5'>
                      {isLoading == true ?
                        <i className='fa fa-spinner fa-spin'></i> : 'تعديل'}
                    </button>
                  </div>
                  <div className="col-md-3">
                    <NavLink to='../clients'
                      className='btn  btn-secondary form-control fs-5'>رجوع</NavLink>
                  </div>
                </Form>
              )
            }
          }
        </Formik>

      </div>


    </>
  )
}
