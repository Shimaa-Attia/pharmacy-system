import axios from 'axios';
import Joi from 'joi';
import React, {useEffect, useState} from 'react'
import {NavLink, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';


export default function AddOrder() {
  let [isLoading, setIsLoading] = useState(false);
  let [orders , setOrders] = useState({
    user_id:'',
    customer_address:'',
    customer_phone:'',
    customer_id:'',
    totalAmmount:'',
    cost:'',
    notes:'',

  });
  let getInputValue = (event) => {
    let myOrders = {...orders}; //deep copy
    myOrders[event.target.name] = event.target.value;
    setOrders(myOrders);
};
  return (
    <>
      <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة أوردر </h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form>
                    <div className="row gy-3">
                        <div className="col-md-4">
                            <label htmlFor="code" className='form-label'>كود الطيار أو الاسم</label>
                            <input type="text" className='form-control' name="code" id="user_id" onChange={getInputValue}/>
                            <select name="role" defaultValue={0} className='form-control' id="role"
                                    onChange={getInputValue}>
                                <option value={0} hidden disabled>اختار</option>
                                <option value="مشرف">مشرف</option>
                                <option value="صيدلي">صيدلي</option>
                                <option value="طيار">طيار</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="customer_id" className='form-label'>كود العميل أو الاسم</label>
                            <input type="text" className='form-control' name="client_name" id="customer_id" onChange={getInputValue}/>
                        </div>
                       
                        <div className="col-md-4">
                            <label htmlFor="phone" className='form-label'>رقم الهاتف</label>
                            <input type="tel" className='form-control' name="phone" id="phone"
                                   onChange={getInputValue}/>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="notes" className='form-label'>ملاحظات</label>
                            <textarea name="notes" id="notes" className='form-control' onChange={getInputValue}/>
                        </div>
                        <div className="col-md-3">
                            <button type='submit' className='btn btn-primary form-control fs-5'>
                                {isLoading == true ? <i className='fa fa-spinner fa-spin'></i> : 'إضافة'}
                            </button>
                        </div>
                        <div className="col-md-3">
                            <NavLink to='/users' className='btn  btn-secondary form-control fs-5'>رجوع</NavLink>

                        </div>
                    </div>
                </form>
            </div>
    </>
  )
}
