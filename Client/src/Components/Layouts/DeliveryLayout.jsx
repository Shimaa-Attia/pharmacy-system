import React, { useContext } from 'react'
import { AuthContext } from '../../Context/AuthStore'
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DeliveryNavbar from '../DeliveryNavbar/DeliveryNavbar';



export default function DeliveryLayout() {
   
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Orders</title>
            </Helmet>
            <DeliveryNavbar />
           
            <Outlet />



        </>
    )
}
