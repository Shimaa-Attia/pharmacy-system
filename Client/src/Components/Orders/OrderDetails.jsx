import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { AuthContext } from '../../Context/AuthStore';


export default function OrderDetails() {
  let { accessToken } = useContext(AuthContext);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Order Details</title>
      </Helmet>
    </>
  )
}
