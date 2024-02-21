import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthStore';
import { toast } from 'react-toastify';

export default function PurchasesInventoryProducts() {
  let { accessToken } = useContext(AuthContext);
  let [notDoneInventoryProducts, setNotDoneInventoryProducts] = useState([]);

  let getNotDoneInventoryProductsData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/inventoryProducts/notDone`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    setNotDoneInventoryProducts(data);
  };
  useEffect(() => {
    getNotDoneInventoryProductsData()
  }, []);
  let [prodStatus, setProdStatus] = useState({
    status_id: 'change'
  })
  let sendInventoryProductsStatusToApi = async (prodId) => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/inventoryProducts/${prodId}`, prodStatus, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      getDoneInventoryProductsData()
      getNotDoneInventoryProductsData()
    }).catch((errors) => {
      toast.error('حدث خطأ ما');
      toast.error(errors?.response?.data?.message);
    })
  }

  let showNotDoneInventoryProducts = () => {
    if (notDoneInventoryProducts.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white m-2 p-3 table-responsive">
          <p className='text-center bg-warning p-1 rounded fs-5 fw-bold'>قائمة الجرد</p>
          <table dir="rtl" responsive='md' className='table  table-hover  align-middle table-responsive-list  '>

            <tbody>
              {notDoneInventoryProducts.map((prod) => <tr key={prod.id}>
                <td >{prod?.productName}</td>
                <td style={{ width: '20px' }} >
                  <div className='text-center' >
                    <i className='bi bi-arrow-left-circle-fill text-success fs-4'
                      onClick={() => sendInventoryProductsStatusToApi(prod.id)} ></i>

                  </div>
                </td>

              </tr>
              )}
            </tbody>
          </table>
        </div>
      )
    } else {
      return (
        <div className=' d-flex justify-content-center  height-calc-70 align-items-center' >
          <div className='alert alert-danger w-50 text-center'>لا يوجد </div>
        </div>
      )
    }
  };
  let [doneInventoryProducts, setDoneInventoryProducts] = useState([]);

  let getDoneInventoryProductsData = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/inventoryProducts/done`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    setDoneInventoryProducts(data);
  };
  useEffect(() => {
    getDoneInventoryProductsData()
  }, []);
      //delete InventoryProducts
      let deleteInventoryProducts = async (prodId) => {
        try {
          let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/api/inventoryProducts/forceDelete/${prodId}`, {
            headers: {
              "Authorization": `Bearer ${accessToken}`
            }
          });
          toast.success(data.message);
          getDoneInventoryProductsData()
        } catch (error) {
    
          toast.error('حدث خطأ ما، حاول مرة أخرى')
        }
      };

  let showDoneInventoryProducts = () => {
    if (doneInventoryProducts.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white m-2 p-3 table-responsive">
          <p className='text-center bg-success p-1 rounded fs-5 fw-bold'>تم جرده</p>
          <table dir="rtl" responsive='md' className='table  table-hover  align-middle table-responsive-list  '>

            <tbody>
              {doneInventoryProducts.map((prod) => <tr key={prod.id}>
                <td style={{ width: '20px' }}  >
                  <div className='text-center' >
                    <i className='bi  bi-arrow-right-circle-fill text-warning fs-4'
                      onClick={() => sendInventoryProductsStatusToApi(prod.id)} ></i>

                  </div>
                </td>
                <td>{prod?.productName}</td>
                <td >
                  <i className='bi bi-trash text-danger fs-5' onClick={() => deleteInventoryProducts(prod.id)}></i>
                </td>

              </tr>
              )}
            </tbody>

          </table>
        </div>
      )
    } else {
      return (
        <div className=' d-flex justify-content-center  height-calc-70 align-items-center' >
     <div className='alert alert-danger w-50 text-center'>لا يوجد </div>
        </div>
      )
    }
  };

  return (


    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Notifications</title>
      </Helmet>

      <div className=" m-4">
        <NavLink to='/purchasesinventoryproducts/add' className='btn btn-primary mb-1' >إضافة منتج</NavLink>
      </div>
      <div className="row" dir='rtl'>
        <div className="col-md-6">
          {showNotDoneInventoryProducts()}
        </div>

        <div className="col-md-6">
          {showDoneInventoryProducts()}
        </div>
      </div>



    </>



  )
}
