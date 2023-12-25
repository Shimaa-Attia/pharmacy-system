import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';
import Joi from 'joi';

export default function SalePoints() {
  //Adding sale point
  let { accessToken } = useContext(AuthContext);
  let formInput = document.getElementById('pointName');
  let [points, setPoints] = useState({
    name: ''
  })
  let getInputValue = (event) => {
    let myPoints = { ...points };
    myPoints[event?.target?.name] = event?.target?.value;
    setPoints(myPoints);
  }
  let sendPointsDataToApi = async () => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/points`, points, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      toast.success(res.data.message);
      formInput.value = '';

    }).catch((errors) => {
      // console.log('erorr');
      // console.log(errors);
      // const errorList = errors?.response?.data?.message;
      // if (errorList !== undefined) {
      //   Object.keys(errorList).map((err) => {
      //     errorList[err].map((err) => {
      //       toast.error(err);
      //     })
      //   });
      // } else {
      //   toast.error("حدث خطأ ما");
      // }
    })
  };

  let validatePointForm = () => {
    const schema = Joi.object({
      name: Joi.string().required(),
    });
    return schema.validate(points, { abortEarly: false });
  };
  let submitPointsForm = (e) => {
    let validation = validatePointForm();
    if (!validation.error) {
      sendPointsDataToApi()
    } else {
      try {
        validation.error.details.map((err) => {
          toast.error(err.message);
        })
      } catch (e) {
        toast.error("حدث خطأ ما");
      }
    }
  };

  //Show Sales Ponits 
  let [salePoints, setSalePoints] = useState([]);
  let getSalePointsData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/points`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    
    setSalePoints(data.data);

  };
  useEffect(() => {
    getSalePointsData()
  }, []);
let [pointId , setPointId] = useState('');
  let showSalePoints = () => {
    if (salePoints.length > 0) {
      return (
        <div  >
          {salePoints.map((point ,index) => <div key={point.id}>
            <div className='d-flex justify-content-between' >
              <div className=' bg-secondary-subtle d-inline p-2 rounded me-3  my-1'> اسم نقطة البيع : </div>
              <div className='bg-body-secondary p-2 rounded my-1'>{point.name}</div>
                   <div className=' bg-secondary-subtle d-inline p-2 rounded me-3  my-1'>  إجمالي المبيعات اليوم : </div>
              <div className='bg-body-secondary p-2 rounded my-1'>{point.today_sales}</div>
              <div className='my-1 ms-3 ' >
                <button className='btn btn-outline-danger btn-sm mx-2' onClick={() => { deleteSalePoint(point.id) }} ><i className='bi bi-trash'></i> حذف </button>
                <button className='btn btn-outline-primary btn-sm' onClick={()=>{
                  getInputInfo(index)
                  console.log(point.id);
                  setPointId(point.id)
                  }}><i className='bi bi-pencil-square'></i> تعديل  </button>
              </div>
            </div>
          </div>)}

        </div>
      )
    } else {
      return (
        <div className='h-75' >
          <div className=' d-flex justify-content-center h-100  align-items-center' >
            <i className='fa fa-spinner fa-spin fa-2x '></i>
          </div>
        </div>
      )
    }
  }

  //delete sale point 
  let deleteSalePoint = async (ponitId) => {
    try {

      let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/api/points/delete/${ponitId}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      toast.success(data.message);
    } catch (error) {

      toast.error('حدث خطأ ما، حاول مرة أخرى')
    }
  };

  //Edite Sale Point 
  let sendEditedPointsDataToApi = async (pointId) => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/points/${pointId}`, points, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      toast.success(res.data.message);
      formInput.value = '';

    }).catch((errors) => {
      const errorList = errors?.response?.data?.message;
      if (errorList !== undefined) {
        Object.keys(errorList).map((err) => {
          errorList[err].map((err) => {
            toast.error(err);
          })
        });
      } else {
        toast.error("حدث خطأ ما");
      }
    })
  };

  let validateEditedPointForm = () => {
    const schema = Joi.object({
      name: Joi.string().empty(''),
    });
    return schema.validate(points, { abortEarly: false });
  };
  let submitEditedPointsForm = (e) => {
    let validation = validateEditedPointForm();
    if (!validation.error) {
      sendEditedPointsDataToApi(pointId)
    } else {
      try {
        validation.error.details.map((err) => {
          toast.error(err.message);
        })
      } catch (e) {
        toast.error("حدث خطأ ما");
      }
    }
  };
  let mainBtn = document.getElementById('mainBtn');
  let submitPointOrEditedPoint = (e) => {
    e.preventDefault();
    if (mainBtn.innerHTML === 'إضافة') {
      submitPointsForm()
      
    } else {
      submitEditedPointsForm()
        mainBtn.innerHTML='إضافة'
        mainBtn.classList.remove('btn-outline-danger');
    }
  }
let pointNameInput = document.getElementById('pointName')
  let getInputInfo=(index)=>{
    pointNameInput.value = salePoints[index]?.name;
    pointNameInput.focus();
    mainBtn.innerHTML='تعديل';
    mainBtn.classList.add('btn-outline-danger');
  }

  return (
    <>
      <div className="container-fluid my-2 ">
        <div className='row gx-1 '>
          <div className="col-md-5">
            <h4 className='alert alert-primary text-center'>إضافة نقطة بيع</h4>
            <form onSubmit={submitPointOrEditedPoint}>
              <div className='w-75 m-auto'>
                <label htmlFor="pointName" className='form-label'>اسم نقطة البيع</label>
                <input type="text" name="name" id="pointName" className='form-control' onChange={getInputValue} />
                <button type='submit' className='btn btn-outline-primary mt-3' id='mainBtn' >إضافة</button>
              </div>
            </form>

          </div>
          <div className="col-md-7 card  p-2 mt-5">
            <h4 className='text-center text-bg-secondary py-2 rounded' >نقاط البيع</h4>
            {showSalePoints()}
          </div>

        </div>
      </div>


    </>
  )
}
