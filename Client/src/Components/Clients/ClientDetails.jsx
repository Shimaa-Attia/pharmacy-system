
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';

export default function ClientDetails() {
  let { accessToken } = useContext(AuthContext);
 
  let navigate = useNavigate();
  let { id } = useParams();
  let [clients, setClients] = useState([]);
  let [contactInfo, setContactInfo] = useState([]);

  let getClientDetails = async () => {
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
    getClientDetails()
  }, [id]);
  return (
    <>
       <Helmet>
        <meta charSet="utf-8" />
        <title>Client Details</title>
      </Helmet>
      <h4 className='text-center alert alert-primary m-3 '>تفاصيل بيانات ({clients.name})</h4>
      <div className="card w-75 m-auto p-3 ">
        <div className="row">
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 mt-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h2 > الاسم : {clients?.name} </h2>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 mt-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h3 className='h2' > كود العميل : {clients?.code} </h3>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 mt-2 ' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h4 className='h3'>أرقام الهواتف :{contactInfo.map((info) => {
                if (info.name === 'phone') {
                  return <p key={info.id} >{info?.value}</p>
                }
              })}
              </h4>
            </div>
          </div>
          <div className=' col-md-6  ' >
            <div className='text-center rounded p-2 my-2 ' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
              <h4 className='h3'>العناوين  :{contactInfo.map((info) => {
                if (info.name === 'address') {
                  return <p key={info.id} >{info?.value}</p>
                }
              })}
              </h4>
            </div>
          </div>
          {clients.notes ? 
           <div className=' col-md-12  ' >
           <div className='text-center rounded p-2' style={{ backgroundColor: ' rgb(160, 200, 240)' }} >
             <h3 className='h2' > ملاحظات  : {clients?.notes} </h3>
           </div>
         </div> : ''
          }
         

        </div>
      </div>


      <div className="col-md-2 m-auto my-2">
        <NavLink to='/clients' className='btn  btn-secondary form-control  '>رجوع</NavLink>
      </div>


    </>
  )
}
