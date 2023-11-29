import React from 'react'

export default function Delivery() {

  let getInputValue=(event)=>{
 
  }
  let SubmitFromData=()=>{
    
  }
  return (
    <>
      <div className=" mt-4 shadow rounded rounded-4 bg-white mx-3 ">
        <div className=' py-3' >
          {/* Button trigger modal */}
          <div className='px-3'>

            <button type="button" className="btn btn-primary  " data-bs-toggle="modal" data-bs-target="#exampleModal">
            إضافة أوردر
            </button>
          </div>
          {/* Modal */}
          <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="btn-close ms-0" data-bs-dismiss="modal" aria-label="Close" />
                  <h1 className="modal-title fs-5 " id="exampleModalLabel">إضافة أوردر</h1>
                </div>
                <div className="modal-body">
                  <form onSubmit={SubmitFromData} >
                    <div className="row gy-2">
                      <div className="col-6">
                      <div className="input-data">
                          <label htmlFor="name" className='form-label'> اسم الطيار  </label>
                          <input type="text" className='form-control' required name="name" id="name" onChange={getInputValue} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-data">
                          <label htmlFor="code" className='form-label'> كود الطيار   </label>
                          <input type="text" className='form-control' required name="code" id="code" onChange={getInputValue} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-data">
                          <label htmlFor="phone2" className='form-label'> أرقام الهواتف للعميل   </label>
                          <input type="tel" className='form-control'  name="phone2" id="phone2" onChange={getInputValue} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-data">
                          <label htmlFor="phone1" className='form-label'> كود العميل  </label>
                          <input type="tel" className='form-control' required name="phone" id="phone1" onChange={getInputValue} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-data">
                          <label htmlFor="address2" className='form-label'> قيمة الأوردر  </label>
                          <input type="text" className='form-control'  name="address" id="address2" onChange={getInputValue} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-data">
                          <label htmlFor="address1" className='form-label'>عناوين العميل  </label>
                          <input type="text" className='form-control' required name="address" id="address1" onChange={getInputValue} />
                        </div>
                      </div>
                      <div className="col-6"></div>
                      <div className="col-6">
                        <div className="input-data">
                          <label htmlFor="address1" className='form-label'>إجمالي المبلغ مع الطيار</label>
                          <input type="text" className='form-control' required name="address" id="address1" onChange={getInputValue} />
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
              <th>الوقت الكلي</th>
              <th>تاريخ التسجيل </th>
              <th>إجمالي الطيار</th>
              <th> قيمة الأوردر</th>
              <th>كود العميل </th>
              <th>رقم الهاتف </th>
              <th>اسم الطيار</th>
              <th>كود الطيار</th>
              
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
