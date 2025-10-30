import React, { useEffect, useContext } from 'react'
import { useSearchParams,useNavigate } from 'react-router-dom';
import "./Verify.css"
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

function Verify() {
    const [searchParams]=useSearchParams();
     const success = searchParams.get("success");
     const orderId = searchParams.get("orderId");
     const {url}=useContext(StoreContext);
     const navigate= useNavigate();
     const verifyOrder=async()=>{
        const response=await axios.post(url+"/api/order/verify",{success,orderId})
        if(response.data.success){
            navigate('/myorders');
        }else{
            navigate("/")
        }
     }    
     useEffect(()=>{
        verifyOrder();
     },[success, orderId, url, navigate])
  return (
    <div className='verify'>
        <div className='spinner'></div>
      
    </div>
  )
}

export default Verify


