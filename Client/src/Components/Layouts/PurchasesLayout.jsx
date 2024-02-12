import React from 'react'
import { Helmet } from 'react-helmet'
import { Outlet } from 'react-router-dom'
import PurchasesNavbar from '../Navbar/PurchasesNavbar'

export default function PurchasesLayout() {
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Purchases</title>
            </Helmet>

           <PurchasesNavbar/>
            <Outlet /></>
    )
}
