import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';



export default function EditeOrder() {
  let { accessToken } = useContext(AuthContext);
  let { id } = useParams();
  let [isLoading, setIsLoading] = useState(false);
  let [orderData, setOrderData] = useState([])


  let [orders, setOrders] = useState({
    user_code: '',
    customer_code: '',
    cost: '',
    notes: '',
    sale_point_id: '',
    paid: '',
    area_id: ''

  });
  let getInputValue = (event) => {
    let myOrders = { ...orders };
    myOrders[event?.target?.name] = event?.target?.value;
    setOrders(myOrders);
  };

  let getOrder = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/show/${id}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setOrderData(data.data);
    setOrders({
      user_code: data.data?.delivery_man?.code,
      customer_code: data.data?.customer?.code,
      cost: data.data?.cost,
      notes: data.data?.notes,
      sale_point_id: data.data?.sale_point?.id,
      paid: data.data?.paid,
      area_id: data.data?.area?.id,
    });

  };
  useEffect(() => {
    getOrder()
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

  let sendEditedDataToApi = async () => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, orders, {
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
      try {
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
      } catch (error) {
        toast.error("حدث خطأ ما");
      }
   
    });
  };

  let validateEditedFrom = () => {
    const schema = Joi.object({
      user_code: Joi.string().required(),
      customer_code: Joi.string().required(),
      cost: Joi.number().required(),
      sale_point_id: Joi.number().required(),
      paid: Joi.any().empty(''),
      area_id: Joi.any().empty(''),
      notes: Joi.any().empty(""),

    });
    return schema.validate(orders, { abortEarly: false });
  };

  let editedOrederSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    let validation = validateEditedFrom();
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
  let [salePoints, setSalePoints] = useState([]);
  let getSalePointsData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/points`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setSalePoints(data.data);

  };
  useEffect(() => {
    getSalePointsData()
  }, []);


  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Edite Order</title>
      </Helmet>
      <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>تعديل الأوردر</h3>
      <div className="mx-5 p-3 rounded rounded-3 bg-white">
        <form onSubmit={editedOrederSubmit} >
          <div className="row gy-3">
            <div className="col-md-4">
              <label htmlFor="user_code" className='form-label'>كود  الموظف </label>
              <input type="text" name="user_code" id="user_code" className='form-control '
                defaultValue={orderData?.delivery_man?.code}
                onChange={getInputValue}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="customer_code" className='form-label'>كود العميل  </label>
              <input type="text" name="customer_code" id="customer_code" className='form-control '
                onChange={getInputValue}
                defaultValue={orderData?.customer?.code}

              />
            </div>
            <div className='col-md-4'>
              <label htmlFor="customer_code" className='form-label'>المنطقة   </label>
              <select name="area_id" defaultValue={0} className='form-control' id="branch_id"
                onChange={getInputValue}>
                <option value={0} hidden disabled>اختر...</option>
                {areasData.map((area) => <option key={area.id} value={area?.id}>{area?.name}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="sale_point_id" className='form-label'>نقطة البيع </label>
              <select name="sale_point_id" defaultValue={0} className='form-control ' id="sale_point_id"
                onChange={getInputValue}>
                <option value={0} hidden disabled>اختر...</option>
                {salePoints.map((point) => <option key={point.id} value={point?.id}  >{point.name}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="cost" className='form-label'>قيمة الأوردر </label>
              <input type="text" className='form-control ' name="cost" id="cost"
                onChange={getInputValue}
                defaultValue={orderData?.cost}

              />
            </div>
         
            <div className="col-md-4">
              <label htmlFor="paid" className='form-label'>القيمة المسددة </label>
              <input type="text" className='form-control ' name="paid" id="paid"
                onChange={getInputValue}
                defaultValue={orderData?.paid}

              />
            </div>
            <div className="col-md-12">
              <label htmlFor="notes" className='form-label'>ملاحظات</label>
              <textarea type='text' name="notes" id="notes" className='form-control editedElement'
                onChange={getInputValue}
                defaultValue={orderData.notes !== null ? orderData.notes : ""}

              />
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
