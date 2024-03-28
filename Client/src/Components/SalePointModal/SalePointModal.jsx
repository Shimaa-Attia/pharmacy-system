import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthStore';

export default function SalePointModal() {
    let { accessToken } = useContext(AuthContext);
    let [salePoints, setSalePoints] = useState([]);
    // Initial state of showModal depends on session storage to prevent the modal to display again when i reload
    let [showModal, setShowModal] = useState(() => !sessionStorage.getItem('modalShown'));

    let getSalePointsData = async () => {
        try {
            let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/points`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            setSalePoints(data.data);
        } catch (error) {
            toast.error('حدث خطأ ما');
        }
    };

    useEffect(() => {
        if(showModal) { // Only fetch sale points if the modal is going to be shown
            getSalePointsData();
        }
    }, [showModal]);

    let getInputValue = (event) => {
        sessionStorage.setItem('salePoint', `${event.target.value}`);
        setShowModal(false); 
        sessionStorage.setItem('modalShown', true); // Add this line
    };

    return (
        <>
            <Modal dir="rtl" show={showModal} onHide={() => {}} centered backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className='text-danger'>يجب تحديد نقطة بيع اليوم</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='w-100'>
                        <label htmlFor="sale_point_id" className='form-label'>اختر نقطة البيع</label>
                        <select name="sale_point_id" defaultValue={0} className='form-control' id="sale_point_id"
                            onChange={getInputValue}>
                            <option value={0} hidden disabled>اختر...</option>
                            {salePoints.map((point) => <option key={point.id} value={point.id}>{point.name}</option>)}
                        </select>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
