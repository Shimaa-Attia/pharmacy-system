import React from 'react'
import { Helmet } from 'react-helmet'
import { Outlet } from 'react-router-dom'
import DoctorNavbar from '../DoctorNavbar/DoctorNavbar'

export default function DoctorLayout() {
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Orders</title>
            </Helmet>

            <DoctorNavbar />
            <Outlet />
        </>
    )
}
