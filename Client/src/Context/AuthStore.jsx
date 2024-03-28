import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";


export let AuthContext = createContext(null);
export default function AuthContextProvider(props) {
    let accessToken = localStorage.getItem('userToken');

    // for handle Reload
    useEffect(() => {
        if (localStorage.getItem('userToken') !== null) {
            saveUserData();
        }
    }, []);
    let [userData, setUserData] = useState(null);
    let [userName, setUserName] = useState(null);
    let saveUserData = () => {
        let encodedToken = localStorage.getItem('userToken');
        let name = localStorage.getItem('userName');
        setUserName(name);
        setUserData(encodedToken);
    };


    let logout = async () => {
        let res = await axios.post(`${process.env.REACT_APP_API_URL}/api/logout`, {}, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        localStorage.removeItem('userToken');
        sessionStorage.clear()
        setUserData(null);
        toast.success(res.data.message, {
            position: 'top-center'
        });
        return <Navigate to='/' />;    
    };


    return <AuthContext.Provider value={{ userData, saveUserData, logout, accessToken, userName }} >
        {props.children}
    </AuthContext.Provider>

}