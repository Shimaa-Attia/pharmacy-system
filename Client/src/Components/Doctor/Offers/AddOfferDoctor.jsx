
import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../Context/AuthStore';
import AddOffer from '../../Offers/AddOffer';

export default function AddOfferDoctor() {
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Add Offer</title>
            </Helmet>
            <AddOffer/>
        </>
    )
}
