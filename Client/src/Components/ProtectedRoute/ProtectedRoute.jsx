import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'


export default function ProtectedRoute(props) {

    if (!localStorage.getItem('userToken')) {
        return <Navigate to='/' />

    }
    else {
   
        return props.children;
    }

    return (
        <>
       
           
        </>
    )
}
