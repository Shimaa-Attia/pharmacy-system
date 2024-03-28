
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';

export default function SalePoints() {
  const { accessToken } = useContext(AuthContext);
  const [points, setPoints] = useState({ name: '' });
  const [salePoints, setSalePoints] = useState([]);
  const [pointId, setPointId] = useState('');
  const [editing, setEditing] = useState(false);

  
  let getSalePointsData = async () => {
    try {
      let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/points`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      setSalePoints(data?.data);
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب البيانات');
    }
  };
  useEffect(() => {
    getSalePointsData();
  }, []);

  const getInputValue = (event) => {
    const { name, value } = event.target;
    setPoints(prevState => ({ ...prevState, [name]: value }));
  };

  const submitPointOrEditedPoint = async (event) => {
    event.preventDefault();
    if (!points.name.trim()) {
      toast.error("اسم نقطة البيع مطلوب");
      return;
    }
    try {
      if (editing) {
        let { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/points/${pointId}`, points, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });
        toast.success(data.message);
      } else {
        let { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/points`, points, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });
        toast.success(data.message);
      }
      setEditing(false);
      setPoints({ name: '' });
      getSalePointsData();
    } catch (error) {
      toast.error('حدث خطأ أثناء العملية');
    }
  };

  const handleEdit = (index) => {
    const point = salePoints[index];
    setPoints({ name: point.name });
    setPointId(point.id);
    setEditing(true);
  };

  const deleteSalePoint = async (pointId) => {
    try {
      let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/api/points/delete/${pointId}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      toast.success(data.message);
      getSalePointsData();
    } catch (error) {
      toast.error('حدث خطأ أثناء العملية');
    }
  };

  return (
    <>
      <div className="container-fluid my-2">
        <div className="row gx-1">
          <div className="col-md-4">
            <h4 className="alert alert-primary text-center">إضافة نقطة بيع</h4>
            <form onSubmit={submitPointOrEditedPoint}>
              <div className="w-75 m-auto">
                <label htmlFor="pointName" className="form-label">اسم نقطة البيع</label>
                <input type="text" name="name" id="pointName" className="form-control" value={points.name} onChange={getInputValue} />
                <button type="submit" className={`btn ${editing ? 'btn-outline-danger' : 'btn-outline-primary'} mt-3`} id="mainBtn">
                  {editing ? 'تعديل' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-8 card p-2 mt-5">
            <h4 className="text-center text-bg-secondary py-2 rounded">نقاط البيع</h4>
            {salePoints.length > 0 ? (
              <div className="w-100">
                {salePoints.map((point, index) => (
                  <div key={point.id} className='row '>
                    <div className="col-md-4 d-flex">
                      <p className="bg-secondary-subtle p-1 ms-2 rounded">اسم النقطة</p>
                      <p className="bg-body-secondary p-1 rounded">{point?.name}</p>
                    </div>
                    <div className="col-md-4 d-flex">
                      <p className="bg-secondary-subtle ms-2 p-1 rounded">رصيد النقطة</p>
                      <p className="bg-body-secondary p-1 rounded">{point?.unpaid_balance}</p>
                    </div>
                    <div className="col-md-4 d-flex">
                      <p>
                        <button className="btn btn-outline-danger btn-sm ms-3" onClick={() => deleteSalePoint(point.id)}><i className="bi bi-trash"></i> حذف</button>
                      </p>
                      <p>
                        <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(index)}><i className="bi bi-pencil-square"></i> تعديل</button>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-75">
                <div className="d-flex justify-content-center h-100 align-items-center">
                  <i className="fa fa-spinner fa-spin fa-2x"></i>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

