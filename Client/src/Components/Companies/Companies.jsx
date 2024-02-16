
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthStore';
import { toast } from 'react-toastify';

export default function Companies() {
  let { accessToken } = useContext(AuthContext);
  let [companies, setCompanies] = useState([]);

  let [searchText, setSearchText] = useState('');
  function handleSearchChange(event) {
    setSearchText(event.target.value);

  };
  let getCompaniesData = async () => {
    let searchResult;
    if (searchText !== undefined && searchText.trim().length > 0) {
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies/search/${searchText.trim()}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setCompanies(searchResult.data);

    } else {
      searchResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setCompanies(searchResult.data);

    }

  };
  useEffect(() => {
    getCompaniesData()
  }, [searchText]);
  //for making checkBox for every one
  let sendUpdateCheckBoxToApi = async (compId) => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/companies/updateCheckBox/${compId}`, {}, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      toast.success(res.data.message);
      getCompaniesData()
    }).catch((errors) => {
      toast.error('حدث خطأ ما');
      toast.error(errors?.response?.data?.message);
    })
  }
  //for making checkBox for every one
  let sendResetCheckBoxToApi = async () => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/companies/updateCheckBox/all`, {}, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      toast.success(res.data.message);
      getCompaniesData()
    }).catch((errors) => {
      toast.error('حدث خطأ ما');
      toast.error(errors?.response?.data?.message);
    })
  }
  let showCompaies = () => {
    if (companies.length > 0) {
      return (
        <div className="shadow rounded rounded-4 bg-white mx-3 p-3 table-responsive">
          <table dir="rtl" responsive='sm' className='table  table-hover text-center align-middle table-responsive-list '>
            <thead className='table-primary  no-wrap-heading  align-middle'>
              <tr>
                <th>اسم الشركة</th>
                <th>هاتف الشركة</th>
                <th>البطاقة الضربيبية</th>
                <th>تعليمات الإدخال</th>
                <th>ملاحظات</th>
                <th>  خيارات</th>
                <th>
                  <div style={{ cursor: 'pointer' }} onClick={sendResetCheckBoxToApi} className='bg-danger text-white p-1 rounded'>عدم تحديد الكل</div>

                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => <tr key={index}>
                <td data-label="اسم الشركة">{company?.name}</td>
                <td data-label="هاتف الشركة">{company?.phoneNumber}</td>
                <td data-label="البطاقة الضريبية">{company?.TaxCard}</td>
                <td data-label="تعليمات الإدخال">{company?.entryInstructions}</td>
                <td data-label="ملاحظات">{company?.notes}</td>
                <td data-label="خيارات" >
                  <NavLink to={`/companies/edite/${company.id}`} >
                    <i className='bi bi-pencil-square text-primary fs-5 mx-1   '></i>
                  </NavLink>
                </td>
                <td>
                  {company.checkBox ? <i className='bi bi-check-circle-fill text-success fs-5'
                    onClick={() => sendUpdateCheckBoxToApi(company.id)} ></i>
                    : <i className='bi bi-x-circle-fill text-danger fs-5 '
                      onClick={() => sendUpdateCheckBoxToApi(company.id)} ></i>}
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
          {companies.length <= 0 && searchText.length <= 0 ?
            <i className='fa fa-spinner fa-spin  fa-5x'></i>
            : <div className='alert alert-danger w-50 text-center'>لا يوجد شركات</div>
          }
        </div>
      )
    }
  };

  return (

    <>
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Companies</title>
        </Helmet>
        <div className=" my-3 text-center row mx-2  ">
          <div className="col-md-6">
            <NavLink to='/companies/add' className='btn btn-primary mb-1' >إضافة شركة</NavLink>
          </div>
          <div className="col-md-4">
            <input type="text" className='form-control text-end mt-1' onChange={handleSearchChange} placeholder=' ...بحث عن شركة ' />
          </div>
        </div>
      </>

      {showCompaies()}

    </>)
}
