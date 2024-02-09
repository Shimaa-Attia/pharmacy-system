
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/AuthStore';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import PurchasesDeatils from './PurchasesDeatils';

export default function DoctorPurchasesDeatils() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title> purchases Details</title>
      </Helmet>
      <PurchasesDeatils/>
  

    </>
  )
}
