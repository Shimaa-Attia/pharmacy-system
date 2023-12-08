import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logout from '../Logout/Logout'

export default function Settings({ setUserData}) {

 
// console.log(props);
  

  
  return (
   <>
   <Logout  setUserData={setUserData}/>
{/* <button className='btn btn-success' onClick={()=>{}}  >تسجيل الخروج</button> */}
   </>
  )
}
