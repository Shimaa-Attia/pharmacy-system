
import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';



export default function AddInventoryProducts() {
    let { accessToken } = useContext(AuthContext);

    const formRef = useRef(null);
    let [isLoading, setIsLoading] = useState(false);
    let [inventoryProducts, setInventoryProducts] = useState({
        productName: ''
    });
    //get the values of input and put them in the inventoryProducts state
    let getInputValue = (event) => {
        let myInventoryProducts = { ...inventoryProducts }; //deep copy
        myInventoryProducts[event.target.name] = event.target.value;
        setInventoryProducts(myInventoryProducts);
    };
    let sendinventoryProductsDataToApi = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/inventoryProducts`, inventoryProducts, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }).then((res) => {
                formRef.current.reset();
                toast.success(res.data.message, {
                    position: 'top-center'
                });
                setIsLoading(false);
                setInventoryProducts({
                  productName: ''
                })
            }).catch((errors) => {
         
                setIsLoading(false);
                const errorList = errors?.response?.data?.message;
                if (errorList !== undefined) {
                    Object.keys(errorList)?.map((err) => {
                        errorList[err]?.map((err) => {
                            toast.error(err);
                        })
                    });
                } else {
                    toast.error("حدث خطأ ما");
                }
            });
        } catch (error) {
            toast.error("حدث خطأ ما");
        }
    };

    let validateInventoryProductsForm = () => {
        const schema = Joi.object({
            productName: Joi.string().required(),
        });
        return schema.validate(inventoryProducts, { abortEarly: false });
    };
    let submitInventoryProductsForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let validation = validateInventoryProductsForm();
        if (!validation.error) {
            sendinventoryProductsDataToApi();
        } else {
            setIsLoading(false);
            try {
                validation?.error?.details?.map((err) => {
                    toast.error(err.message);
                })
            } catch (e) {
                toast.error("حدث خطأ ما");
            }
        }
    };

    return (
        <>
           
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة منتج </h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form ref={formRef} onSubmit={submitInventoryProductsForm} >
                    <div className="row gy-3">
                    <div className="col-md-12">
                            <label htmlFor="productName" className='form-label'>إسم المنتج</label>
                            <input className='form-control' name="productName"
                                onChange={getInputValue} />
                        </div>
             
                        <div className="col-md-3">
                            <button type='submit' className='btn btn-primary form-control fs-5'>
                                {isLoading == true ? <i className='fa fa-spinner fa-spin'></i> : 'إضافة'}
                            </button>
                        </div>

                    </div>
                </form >
            </div >
        </>
    )
}
