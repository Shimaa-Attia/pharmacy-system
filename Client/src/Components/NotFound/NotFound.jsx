import React from 'react';
import styles from './NotFound.module.css'
import { Helmet } from 'react-helmet';


export default function NotFound() {
  return (
    <>
       <Helmet>
        <meta charSet="utf-8" />
        <title>Not Found</title>
      </Helmet>
    <h1 className={`${styles.color} text-center fw-bolder `} >Oops!</h1>
    <h2 className='text-center' >Page Not Found </h2>
    
    
    </>
  )
}
