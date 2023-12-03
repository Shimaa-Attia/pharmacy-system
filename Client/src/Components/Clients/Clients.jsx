import React, { useState } from 'react'

export default function Clients() {
  let [clients, setClients] = useState({
    code: '',
    name: '',
    phones: [],
    address: [],
    notes: ''

  });

  let getInputValuee = (event) => {
    let myClients = { ...clients };
    myClients[event.target.name] = event.target.value;
    setClients(myClients);
    console.log(myClients);
  }

  let SubmitFromDataForClients = (e) => {
    e.preventDefault();
    alert('hello')


  }
  let [phoneRow, setPhoneRow] = useState(1);
  let phoneNumbers = [];

  let addMore = (type) => {
    if (type == 'phone') {
      setPhoneRow++;
      let phoneNumbers=  Array.from({length:phoneRow},(_,index)=>'row')
    }
  }

  return (
    <>
      <div className=" mt-4 shadow rounded rounded-4 bg-white mx-3 ">
        <div className=' py-3' >
          {/* Button trigger modal */}
          <div className='px-3'>

            <button type="button" className="btn btn-primary  " data-bs-toggle="modal" data-bs-target="#exampleModal">
              إضافة عميل
            </button>
          </div>
          {/* Modal */}
          <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="btn-close ms-0" data-bs-dismiss="modal" aria-label="Close" />
                  <h1 className="modal-title fs-5 " id="exampleModalLabel">إضافة عميل</h1>
                </div>
                <div className="modal-body">
                  <form onSubmit={SubmitFromDataForClients} >
                    <div className="row gy-2">
                      <div className="col-6">
                        <div className="input-data">
                          <label htmlFor="name" className='form-label'> الاسم  </label>
                          <input type="text" className='form-control' required name="name" id="name" onChange={getInputValuee} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-data">
                          <label htmlFor="code" className='form-label'> كود العميل </label>
                          <input type="text" className='form-control' required name="code" id="code" onChange={getInputValuee} />
                        </div>
                      </div>

                   
                      <div className="col-6" >
                        <div className="input-data">
                          <label htmlFor="phone" className='form-label'>  رقم الهاتف </label>
                          <input type="tel" className='form-control' required name="phone" id="phone" onChange={getInputValuee} />
                        </div>
                      </div>
                      <div className="col-6"></div>
                      <div className="col-6 py-1">
                        <button className='btn btn-success rounded rounded-4' onClick={addMore('phone')} >إضافة المزيد</button>
                      </div>
                      <div className="col-6">
                        <div className="input-data">
                          <label htmlFor="address2" className='form-label'> 2 عنوان  </label>
                          <input type="text" className='form-control' name="address" id="address2" onChange={getInputValuee} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-data">
                          <label htmlFor="address1" className='form-label'> 1 عنوان  </label>
                          <input type="text" className='form-control' required name="address" id="address1" onChange={getInputValuee} />
                        </div>
                      </div>
                      <div className="col-6"></div>
                      <div className="col-6 py-1">
                        <button className='btn btn-success rounded rounded-4'>إضافة المزيد</button>
                      </div>

                      <div className="col-12">
                        <div className="input-data">
                          <label htmlFor="notes" className='form-label'> ملاحظات </label>
                          <textarea type="text" className='form-control' name="notes" id="notes" onChange={getInputValuee} />
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
              <th>العناوين </th>
              <th>أرقام الهواتف</th>
              <th>الاسم</th>
              <th>كود العميل</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>

            <tr>

            </tr>


          </tbody>

        </table>
      </div>




    </>)
}
