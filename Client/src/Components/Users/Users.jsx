import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Login from '../Login/Login';

export default function Users() {
  let navigate = useNavigate();
  let [users, setUsers] = useState({

    name: '',
    role: '',
    phone: '',
    password: '',
    hourRate: '',
    notes: '',
  });

  let getInputValue = (event) => {
    let myUsers = { ...users }; //deep copy
    myUsers[event.target.name] = event.target.value;
    setUsers(myUsers);
    console.log(myUsers);
  }
  let [errorMsg, setErrorMsg] = useState('');
  let SubmitFromData = async (e) => {
    e.preventDefault();
    alert('hello')
    // let { data } = await axios.post(`/api/users`, users);
    // console.log(data);
    // if (data.message == 'success') {

    // }
    // else {
    // setErrorMsg(data.message);

    // }
  }


  let showUserDate = () => {


  }


  return (
    <>
    {errorMsg.length > 0 ?<div className="alert alert-danger m-4 ">{errorMsg}</div> :''}
      <div className=" mt-4 shadow rounded rounded-4 bg-white mx-3 ">
        <div className=' py-3' >
          {/* Button trigger modal */}
          <div className='text-center'>

            <button type="button" className="btn btn-primary  " data-bs-toggle="modal" data-bs-target="#exampleModal">
              إضافة مستخدم
            </button>
          </div>
          {/* Modal */}
          <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="btn-close ms-0" data-bs-dismiss="modal" aria-label="Close" />
                  <h1 className="modal-title fs-5 " id="exampleModalLabel">إضافة مستخدم</h1>
                </div>
                <div className="modal-body">
                  <form onSubmit={SubmitFromData} >
                    <div className="row gy-2">
                      <div className="col-6">
                        <div className="input-data">
                          <label htmlFor="role" className='form-label'> الوظيفة </label>
                          {/* <input type="text" className='form-control' name="role" id="role" /> */}
                          <select name="role" defaultValue={0} required className='form-control text-end ' onChange={getInputValue} >
                            <option hidden disabled value={0} >اختار</option>
                            <option value='admin'>مشرف</option>
                            <option value='doctor'>صيدلي</option>
                            <option value='delively'>طيار</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-data">
                          <label htmlFor="name" className='form-label'> الاسم </label>
                          <input type="text" className='form-control' required name="name" id="name" onChange={getInputValue} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-data">
                          <label htmlFor="hourRate" className='form-label'>  سعر الساعة</label>
                          <input type="text" className='form-control' required name="hourRate" id="hourRate" onChange={getInputValue} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-data">
                          <label htmlFor="phone" className='form-label'> رقم الهاتف </label>
                          <input type="tel" className='form-control' required name="phone" id="phone" onChange={getInputValue} />
                        </div>
                      </div>
                      <div className="col-6 ">
                        <div className="input-data ">
                          <label htmlFor="password" className='form-label'> كلمة السر </label>
                          <input type="password" className='form-control ' name="password" id="password" onChange={getInputValue} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-data">
                          <label htmlFor="salary" className='form-label'> الراتب </label>
                          <input type="number" className='form-control' name="salary" id="salary" onChange={getInputValue} />
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
                      <button type="submit" className="btn btn-primary "  >إضافة</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <table className='table table-bordered table-hover  '>
          <thead>
            <tr>
              <th>ملاحظات</th>
              <th>سعر الساعة</th>
              <th>رقم الهاتف</th>
              <th>الوظيفة</th>
              <th>الاسم</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>

            <tr>
              <td>عنده حساسيه من نوع معين</td>
              <td>1020000</td>
              <td>20</td>
              <td>01127699777</td>
              <td>دكتور</td>
              <td>شيماء</td>
              <td>1</td>
            </tr>
            <tr>
              <td>عنده حساسيه من نوع معين</td>
              <td>1020000</td>
              <td>20</td>
              <td>01127699777</td>
              <td>دكتور</td>
              <td>شيماء</td>
              <td>1</td>
            </tr>
            <tr>
              <td>عنده حساسيه من نوع معين</td>
              <td>1020000</td>
              <td>20</td>
              <td>01127699777</td>
              <td>دكتور</td>
              <td>شيماء</td>
              <td>1</td>
            </tr>

          </tbody>

        </table>
      </div>




    </>
  )
}
