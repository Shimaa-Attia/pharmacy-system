import React from 'react'
import {Navigate} from 'react-router-dom'
export default function ProtectedRoute({userData,children}) {
    
    //TODO:: check if user is logged in

    if (userData == null && localStorage.getItem('userToken') == null ) {
        return <Navigate to='/'/>

    } else {

        return children;
    }

    return (
        <>


        </>
    )
}
