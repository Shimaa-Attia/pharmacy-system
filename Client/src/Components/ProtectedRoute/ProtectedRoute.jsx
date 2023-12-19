import React, {useContext, useEffect, useState} from 'react'
import {Navigate, useNavigate} from 'react-router-dom'
import axios from "axios";
import {AuthContext} from "../../Context/AuthStore";


export default function ProtectedRoute({userData, children}) {

    let {accessToken} = useContext(AuthContext);
    let [user, setUser] = useState(null);

    let getUserData = async () => {
        try {
            let {data} = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/auth`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (data !== null) {
                setUser(data)
            }

        } catch (error) {
            console.log(error)
            setUser(null)
        }


    };

    //TODO:: check if user is logged in
    //     getUserData()

    if (userData == null & localStorage.getItem('userToken') == null & user == null) {

        return <Navigate to='/'/>

    } else {

        return children;
    }

    return (
        <>


        </>
    )
}
