import axios from 'axios';
import Joi from 'joi';
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


export default function AddUser() {
  let navigate = useNavigate();
  let [addUserSuccess, setAddUserSuccess] = useState([]);
  let [errorList, setErrorList] = useState([]);
  let [errorMsg, setErrorMsg] = useState('');
  let [isLoading, setIsLoading] = useState(false);
  let [users, setUsers] = useState({
    name: '',
    role: '',
    phone: '',
    password: '',
    password_confirmation: '',
    salary: '',
    code: '',
    hourRate: '',
    notes: '',
  });
  let getInputValue = (event) => {
    let myUsers = { ...users }; //deep copy
    myUsers[event.target.name] = event.target.value;
    setUsers(myUsers);
  }
  let sendUserDataToApi = async () => {
    await axios.post(`http://pharma-erp.atomicsoft-eg.com/api/users`, users).then((res) => {
      setAddUserSuccess(res.data.message);
      console.log(addUserSuccess);
      setIsLoading(false);
      navigate('../users');

    }).catch((errors) => {
      setIsLoading(false);
      setErrorMsg(errors.response.data.error);
      console.log(errorMsg);

    });
  }

  let validateUserFrom = () => {
    const schema = Joi.object({
      name: Joi.string().alphanum().min(3).max(20).required(),
      code: Joi.string().required(),
      role: Joi.string().required(),
      phone: Joi.string().required().pattern(/^01[0125][0-9]{8}$/),
      password: Joi.string().required(),
      password_confirmation: Joi.ref('password'),
      hourRate: Joi.number().required(),
      salary: Joi.number(),
      notes: Joi.string(),

    });
    return schema.validate(users, { abortEarly: false });

  }
  let SubmitUserForm = (e) => {
    setIsLoading(true);
    e.preventDefault();
    let validation = validateUserFrom();
    if (validation.error) {
      setIsLoading(false);
      setErrorList(validation.error.details)

    } else {
      sendUserDataToApi();
    }
  }

  // let showSuccessNotify = () => {
  //   if (addUserSuccess.length > 0) {
  //     toast.success(addUserSuccess)
  //   }

  // }
  return (
    <>
      {/* <div>
        <button onClick={showSuccessNotify}>Notify!</button>
        <ToastContainer />
      </div> */}
      {errorList.map((err, index) => {
        if (err.context.label === 'phone') {
          return <div key={index} className='alert alert-danger' > Phone is invalid</div>
        }
        else {
          return <div key={index} className='alert alert-danger' >{err.message}</div>
        }
      })
      }

      {/* <div className=' py-3' >
      
        <div className='text-center'>
          <button type="button" className="btn btn-primary  " data-bs-toggle="modal" data-bs-target="#exampleModal">
            إضافة مستخدم
          </button>
        </div>
      
        <div className="modal fade " id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog 	modal-lg ">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="btn-close ms-0" data-bs-dismiss="modal" aria-label="Close" />
                <h1 className="modal-title fs-5 " id="exampleModalLabel">إضافة مستخدم</h1>
              </div>
              <div className="modal-body">
                <form onSubmit={SubmitUserForm} >
                  <div className="row gy-2">
                    <div className="col-6">
                      <div className="input-data">
                        <label htmlFor="name" className='form-label'> الاسم </label>
                        <input type="text" className='form-control' name="name" id="name" onChange={getInputValue} />
                      </div>
                    </div>
              
                    <div className="col-6">
                      <div className="input-data">
                        <label htmlFor="code" className='form-label'> كود العميل </label>
                        <input type="text" className='form-control' name="code" id="code" onChange={getInputValue} />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="input-data">
                        <label htmlFor="phone" className='form-label'> رقم الهاتف </label>
                        <input type="tel" className='form-control' name="phone" id="phone" onChange={getInputValue} />
                      </div>
                    </div>
                     <div className="col-6">
                      <div className="input-data">
                        <label htmlFor="role" className='form-label'> الوظيفة </label>
                        
                        <select name="role" defaultValue={0} className='form-control text-end' onChange={getInputValue} >
                          <option hidden disabled value={0} >اختار</option>
                          <option value='مشرف'>مشرف</option>
                          <option value='صيدلي'>صيدلي</option>
                          <option value='طيار'>طيار</option>
                        </select>
                      </div>
                    </div>
                       
                    <div className="col-6">
                      <div className="input-data">
                        <label htmlFor="salary" className='form-label'> الراتب </label>
                        <input type="number" className='form-control' name="salary" id="salary" onChange={getInputValue} />
                      </div>
                    </div>
                        
                    <div className="col-6">
                      <div className="input-data">
                        <label htmlFor="hourRate" className='form-label'>  سعر الساعة</label>
                        <input type="text" className='form-control' name="hourRate" id="hourRate" onChange={getInputValue} />
                      </div>
                    </div>
                    <div className="col-6 ">
                      <div className="input-data ">
                        <label htmlFor="password_confirmation" className='form-label'> تأكيد كلمة السر  </label>
                        <input type="password" className='form-control ' name="password_confirmation" id="password_confirmation" onChange={getInputValue} />
                      </div>
                    </div>
                      
                    <div className="col-6 ">
                      <div className="input-data ">
                        <label htmlFor="password" className='form-label'> كلمة السر </label>
                        <input type="password" className='form-control ' name="password" id="password" onChange={getInputValue} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="input-data">
                        <label htmlFor="notes" className='form-label'> ملاحظات </label>
                        <textarea type="text" className='form-control' name="notes" id="notes" onChange={getInputValue} />
                      </div>
                    </div>

                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">غلق</button>
                    <button type="submit" className="btn btn-primary ">
                      {isLoading == true ? <i className='fa fa-spinner fa-spin'></i> : 'إضافة'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>  */}

 <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة عميل جديد</h3>
      <div className="mx-5 p-3 rounded rounded-3 bg-white">
        {addUserSuccess.length > 0 ? <h4 className='alert alert-danger'>{addUserSuccess}</h4> : ''}
        <form onSubmit={SubmitUserForm}>
          <div className="row gy-3">
            <div className="col-md-4">
              <label htmlFor="code" className='form-label'>كود العميل</label>
              <input type="text" className='form-control' name="code" id="code" onChange={getInputValue} />
            </div>
            <div className="col-md-4">
              <label htmlFor="name" className='form-label'>الاسم</label>
              <input type="text" className='form-control' name="name" id="name" onChange={getInputValue} />
            </div>
            <div className="col-md-4">
              <label htmlFor="role" className='form-label'>الوظيفة</label>
              <select name="role" defaultValue={0} className='form-control' id="role" onChange={getInputValue}>
                <option value={0} hidden disabled >اختار</option>
                <option value="مشرف">مشرف</option>
                <option value="صيدلي">صيدلي</option>
                <option value="طيار">طيار</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="phone" className='form-label'>رقم الهاتف</label>
              <input type="tel" className='form-control' name="phone" id="phone" onChange={getInputValue} />
            </div>
            <div className="col-md-4">
              <label htmlFor="hourRate" className='form-label'>سعر الساعة </label>
              <input type="number" className='form-control' name="hourRate" id="hourRate" onChange={getInputValue} />
            </div>
            <div className="col-md-4">
              <label htmlFor="salary" className='form-label'>الراتب</label>
              <input type="number" className='form-control' name="salary" id="salary" onChange={getInputValue}/>
            </div>
            <div className="col-md-4">
              <label htmlFor="password" className='form-label' >كلمة السر</label>
              <input type="password" className='form-control' name="password" id="password" onChange={getInputValue} />
            </div>
            <div className="col-md-4">
              <label htmlFor="password_confirmation" className='form-label' >تأكيد كلمة السر</label>
              <input type="password" className='form-control' name="password_confirmation" id="password_confirmation"onChange={getInputValue} />
            </div>
            <div className="col-md-12">
              <label htmlFor="notes" className='form-label' >ملاحظات</label>
              <textarea name="notes" id="notes" className='form-control' onChange={getInputValue} /> 
            </div>
            <div className="col-md-3">
            <button type='submit' className='btn btn-primary form-control fs-5' >
              {isLoading == true ? <i className='fa fa-spinner fa-spin'></i> :'إضافة'}
            </button>
            </div>
            <div className="col-md-3">
              <NavLink to='../users' className='btn  btn-secondary form-control fs-5' >رجوع</NavLink>
              
            </div>
          </div>
        </form>
      </div>
     





    </>
  )
}
