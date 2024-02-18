import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Field, Form, Formik } from "formik";
import { Helmet } from 'react-helmet';
import { AuthContext } from '../../Context/AuthStore';
import Select from 'react-select';

export default function EditeClient() {
  let { accessToken } = useContext(AuthContext);
  let [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  let { id } = useParams();
  let [clients, setClients] = useState({
    code: '',
    name: '',
    areas: [],
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
        phones: phones,
        addresses: addresses,
        onHim: data?.data?.onHim || '',
        forHim: data?.data?.forHim || '',
        notes: data?.data?.notes || ''
      });
      // console.log(clients);
    } catch (error) {
      toast.error('حدث خطأ ما، حاول مرة أخرى')
    }

  };

  useEffect(() => {
    getOneClient()

  }, []);
  //getting areas data to display in select 
  let [areasData, setAreasData] = useState([]);
  let getAreasData = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/areas`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setAreasData(data);
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب البيانات');
    }
  }
  useEffect(() => {
    getAreasData();
  }, []);
  //making map on the areas data to display the name in the option
  let [areasOptions, setAreasOptions] = useState([])
  useEffect(() => {
    let mapAreas = areasData?.map((area) => ({
      value: `${area.id}`,
      label: `${area.name}`
    }));
    setAreasOptions(mapAreas);
  }, [areasData]);
  let handleAreaChange = (selectedOption) => {
    let selectedValues = selectedOption.map((opt) => opt.value)
    setClients((prevProject) => ({
      ...prevProject,
      areas: selectedValues,
    }));
  };


  let sendEditedDataToApi = async (values) => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/customers/${id}`, values, {
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
  let validateClientForm = (values) => {
    const schema = Joi.object({
      name: Joi.string().empty(''),
      code: Joi.string().required(),
      phones: Joi.any().empty(null),
      addresses: Joi.any().empty(null),
      areas: Joi.any().empty(''),
      onHim: Joi.any().empty(null),
      forHim: Joi.any().empty(null),
      notes: Joi.any().empty(''),

    });
    return schema.validate(values, { abortEarly: false });
  };
  let submitEditedClient = (values) => {

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
  let [showInput, setShowInput] = useState(false);
  let toggleInput = () => {
    setShowInput(!showInput);
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Edite Client</title>
      </Helmet>
      <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'> تعديل بيانات ({clients?.name}) </h3>
      <div className="mx-5 p-3 rounded rounded-3 bg-white">


        <Formik initialValues={{ ...clients }}
          enableReinitialize={true} onSubmit={(values) => {
            submitEditedClient(values);
          }}>
          {
            formik => {
              return (
                <Form className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="code" className='form-label'>كود العميل</label>
                    <Field type="text" className='form-control' name="code" id="code" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="name" className='form-label'>الاسم</label>
                    <Field type="text" className='form-control' name="name" id="name" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="areas" className='form-label'>المنطقة</label>
                    <Select
                      name="areas"
                      options={areasOptions}
                      isMulti
                      onChange={handleAreaChange}
                      isSearchable={true}
                      placeholder="بحث عن منطقة..."

                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone1" className='form-label'> رقم هاتف</label>
                    <Field type="text" id="phone1" className='form-control' name="phones[0].value" />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="addresses1" className='form-label'> عنوان</label>

                    <Field type="text" id="addresses1" className='form-control' name="addresses[0].value" />
                  </div>
                  {showInput && <div className="col-md-6">
                    <label htmlFor="phone2" className='form-label'> رقم هاتف آخر </label>
                    <Field type="text" id="phone2" className='form-control' name="phones[1].value" />
                  </div>}
                  {showInput && <div className="col-md-6">
                    <label htmlFor="addresses2" className='form-label'> عنوان آخر</label>

                    <Field type="text" id="addresses2" className='form-control' name="addresses[1].value" />
                  </div>}
                  <div className="col-md-12 ">
                    <button type='button' className='btn btn-success' onClick={toggleInput} >
                      {showInput === false ? 'إضافة المزيد' : 'إخفاء'}
                    </button>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="onHim" className='form-label'>عليه</label>
                    <Field type="text" className='form-control' name="onHim" id="name" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="forHim" className='form-label'>له</label>
                    <Field type="text" className='form-control' name="forHim" id="name" />
                  </div>

                  <div className="col-md-12">
                    <label htmlFor="notes" className='form-label'>ملاحظات</label>
                    <Field type="text" as="textarea" id="notes" className='form-control' name="notes" />

                  </div>
                  <div className="col-md-3">
                    <button type='submit' className='btn btn-primary form-control fs-5'>
                      {isLoading == true ?
                        <i className='fa fa-spinner fa-spin'></i> : 'تعديل'}
                    </button>
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
