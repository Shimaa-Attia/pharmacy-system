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
    let saveUserData = () => {
        let encodedToken = localStorage.getItem('userToken');
        setUserData(encodedToken);
    };
    let [users, setUsers] = useState({
        phone: '',
        password: '',
      });
let [deliveryData , setDeliveryData] = useState([]);
    let loginDeliveryData =async () =>{
        let { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, users);
         if (data.user.role === 'delivery') {
        setDeliveryData(data.user);
        console.log('hello i am delivery');
      }
    };

    let logout = async () => {
        let res = await axios.post(`${process.env.REACT_APP_API_URL}/api/logout`, {}, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        localStorage.removeItem('userToken');
        setUserData(null);
        toast.success(res.data.message, {
            position: 'top-center'
        });
        <Navigate to='/' />
    };


    return <AuthContext.Provider value={{ userData, saveUserData, logout, accessToken ,loginDeliveryData , deliveryData }} >
        {props.children}
    </AuthContext.Provider>

}