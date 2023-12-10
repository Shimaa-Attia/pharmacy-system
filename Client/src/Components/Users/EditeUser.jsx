import axios from 'axios';
import Joi from 'joi';
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function EditeUser() {
  let accessToken = localStorage.getItem('userToken');
  let [isLoading, setIsLoading] = useState(false);
  let [users, setUsers] = useState({
    name: '',
    role: '',
    phone: '',
    salary: '',
    code: '',
    hourRate: '',
    notes: '',
  });
  let { id } = useParams();
  let navigate = useNavigate();

  let getInputValue = (event) => {
    let myUsers = { ...users }; //deep copy
    myUsers[event.target.name] = event.target.value;
    setUsers(myUsers);
  };

  let getUser = async () => {
    try {
      let { data } = await axios.get(`http://pharma-erp.atomicsoft-eg.com/api/users/show/${id}`);
      setUsers(data.data);

    } catch (error) {
      toast.error('حدث خطأ ما، حاول مرة أخرى')
    }
  };
  useEffect(() => { getUser() }, []);


  let sendEditedDataToApi = async () => {
    await axios.put(`http://pharma-erp.atomicsoft-eg.com/api/users/${id}`, users, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      toast.success(res.data.message, {
        position: 'top-center'
      });
      setIsLoading(false);
      navigate('../users');

    }).catch((errors) => {
      setIsLoading(false);
      const errorList = errors?.response?.data?.message;
      if (errorList !== undefined) {
        Object.keys(errorList).map((err) => {
          errorList[err].map((err) => {
            toast.error(err);
          })
        });
      } else {
        toast.error("حدث خطأ ما");
      }
    });
  };
  let validateEditedFrom = () => {
    const schema = Joi.object({
      id:Joi.number().required(),
      name: Joi.string().min(3).max(20).required(),
      code: Joi.string().required(),
      role: Joi.string().required(),
      phone: Joi.string().required().pattern(/^01[0125][0-9]{8}$/).message('رقم الهاتف غير صالح'),
      hourRate: Joi.number().required(),
      salary: Joi.number().empty(''),
      notes: Joi.string().empty(''),

    });
    return schema.validate(users, { abortEarly: false });

  };

  let editeUserSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    sendEditedDataToApi();
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
  }

  return (
    <>
      <h4 className='alert alert-primary mx-5 my-2 text-center' >تعديل بيانات ({users.name})</h4>
      <div className="mx-5 p-3 rounded rounded-3 bg-white">
        <form onSubmit={editeUserSubmit} >
          <div className="row gy-3">
            <div className="col-md-4">
              <label htmlFor="code" className='form-label'>كود المستخدم</label>
              <input type="text" className='form-control' name="code" id="code"
                onChange={getInputValue} value={users.code} />
            </div>
            <div className="col-md-4">
              <label htmlFor="name" className='form-label'>الاسم</label>
              <input type="text" className='form-control' name="name" id="name"
                onChange={getInputValue} value={users.name} />
            </div>
            <div className="col-md-4">
              <label htmlFor="role" className='form-label'>الوظيفة</label>
              <select name="role" className='form-control' id="role"
                onChange={getInputValue} value={users.role} >
                <option value={0} hidden disabled>اختار</option>
                <option value="مشرف">مشرف</option>
                <option value="صيدلي">صيدلي</option>
                <option value="طيار">طيار</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="phone" className='form-label'>رقم الهاتف</label>
              <input type="tel" className='form-control' name="phone" id="phone"
                onChange={getInputValue} value={users.phone} />
            </div>
            <div className="col-md-4">
              <label htmlFor="hourRate" className='form-label'>سعر الساعة </label>
              <input type="number" className='form-control' name="hourRate" id="hourRate"
                onChange={getInputValue} value={users.hourRate} />
            </div>
            <div className="col-md-4">
              <label htmlFor="salary" className='form-label'>الراتب</label>
              <input type="number" className='form-control' name="salary" id="salary"
                onChange={getInputValue} value={users.salary} />
            </div>
            <div className="col-md-12">
              <label htmlFor="notes" className='form-label'>ملاحظات</label>
              <textarea name="notes" id="notes" className='form-control'
                onChange={getInputValue} value={users.notes} />
            </div>
            <div className="col-md-3">
              <button type='submit' className='btn btn-primary form-control fs-5'>
                {isLoading == true ? <i className='fa fa-spinner fa-spin'></i> : 'تعديل'}
              </button>
            </div>
            <div className="col-md-3">
              <NavLink to='../users' className='btn  btn-secondary form-control fs-5'>رجوع</NavLink>

            </div>
          </div>
        </form>
      </div>




    </>
  )
}
