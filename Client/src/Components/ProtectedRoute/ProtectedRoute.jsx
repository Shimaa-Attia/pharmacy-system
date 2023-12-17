import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'


export default function ProtectedRoute({ userData, children }) {


    if (userData == null & localStorage.getItem('userToken') == null) {
        //TODO: check if user is logged in
        return <Navigate to='/' />

    }
    else {

        return children;
    }

    return (
        <>


        </>
    )
}
