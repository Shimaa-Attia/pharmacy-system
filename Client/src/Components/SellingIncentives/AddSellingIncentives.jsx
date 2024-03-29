
import axios from 'axios';
import Joi from 'joi';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';



export default function AddSellingIncentives() {
    let { accessToken } = useContext(AuthContext);
    //selcting form  to reset the form after submtion
    const formRef = useRef(null);


    let [isLoading, setIsLoading] = useState(false);
    let [sellingIncentives, setSellingIncentives] = useState({
        productName: '',
        usage: '',
        composition: '',
        incentiveReason_id: '',
        incentivesPercentatge: '',
        notes: ''
    });
    //get the values of input and put them in the sellingIncentives state
    let getInputValue = (event) => {
        let mySellingIncentives = { ...sellingIncentives }; //deep copy
        mySellingIncentives[event.target.name] = event.target.value;
        setSellingIncentives(mySellingIncentives);
    };
    let sendSellingIncentivesDataToApi = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/incentives`, sellingIncentives, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }).then((res) => {
                formRef.current.reset();
                toast.success(res.data.message, {
                    position: 'top-center'
                });
                setIsLoading(false);
            }).catch((errors) => {
                console.log(errors);
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

    let validateSellingIncentivesForm = () => {
        const schema = Joi.object({
            productName: Joi.string().required().messages({
                'string.empty': 'اسم المنتج  مطلوب',
                'any.required': 'اسم المنتج  مطلوب',
            }),
            usage: Joi.string().empty(''),
            composition: Joi.string().empty(''),
            incentiveReason_id: Joi.number().empty(''),
            incentivesPercentatge: Joi.number().empty(''),
            notes: Joi.string().empty('')
        });
        return schema.validate(sellingIncentives, { abortEarly: false });
    };
    let submitSellingIncentivesForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let validation = validateSellingIncentivesForm();
        if (!validation.error) {
            sendSellingIncentivesDataToApi();
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
  //get reason data
  let [reasonData, setReasonData] = useState([]);
  let getReasonData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/getCustomList/incentiveReason`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setReasonData(data)
  }
  useEffect(() => {
    getReasonData()
  }, []);
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Add Incentive</title>
            </Helmet>
            <h3 className='alert alert-primary text-center mx-5 my-2  fw-bold'>إضافة منتج </h3>
            <div className="mx-5 p-3 rounded rounded-3 bg-white">
                <form ref={formRef} onSubmit={submitSellingIncentivesForm} >
                    <div className="row gy-3">
                        <div className="col-md-4">
                            <label htmlFor="productName" className='form-label'>اسم المنتج </label>
                            <input type="text" className='form-control' name="productName"

                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="usage" className='form-label'>استخدامه</label>
                            <input type="text" className='form-control' name="usage"

                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="composition" className='form-label'> تركيب المنتج </label>
                            <input type="text" className='form-control' name="composition"

                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="incentiveReason_id" className='form-label'>السبب</label>
                            <select name="incentiveReason_id" className='form-control m-auto'  defaultValue={0} onChange={getInputValue}>
                                <option value={0} hidden disabled>اختر</option>
                                {reasonData.map((reas) => <option key={reas.id} value={reas.id}>{reas?.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="incentivesPercentatge" className='form-label'> نسبة حافز البيع  </label>
                            <input type="text" className='form-control' name="incentivesPercentatge"

                                onChange={getInputValue} />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="notes" className='form-label'>ملاحظات</label>
                            <textarea name="notes" id="notes" className='form-control'

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
