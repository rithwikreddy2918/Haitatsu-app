import React from 'react'
import "./Orders.css"
import { useState,useEffect } from 'react';
import axios from 'axios';
import {toast} from "react-toastify";
import { assets } from '../../assets/assets';
const Order = ({url}) => {
  const [orders,setOrders]=useState([]);
  const fetchAllOrders=async()=>{
    
      const response=await axios.get(url+"/api/order/list");
      if(response.data.success){
        setOrders(response.data.data);
        console.log(response.data.data);
      }else{
       toast.error("error");
      }
  } 
  const statusHandler=async(event,orderId)=>{
    const response=await axios.post(url+"/api/order/status",{orderId:orderId,status:event.target.value});
    if(response.data.success){
      await fetchAllOrders();
      toast.success(response.data.message);
      
    }
  }
  useEffect(()=>{
    fetchAllOrders();
  },[])
  return (
    <div  className="orders add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order,index)=>(
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item,index)=>{
                  if(index===order.items.length-1){
                    return item.name+"x"+item.quantity;
                  }
                  else{
                    return item.name+"x"+item.quantity+", ";
                  }
            })}     
              </p>
              <p className='order-item-name'>
                {order.address.firstName+" "+order.address.lastName}
              </p>
              <div className='order-item-address'>
                {order.address.street+", "+order.address.city+", "+order.address.state+", "+order.address.country+", "+order.address.zipCode}
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>Amount : ${order.amount}</p>
            <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
              <option value="Food processing">Food processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
              </select>
          </div>
        ))}
      </div>
      
    </div>
  )
}

export default Order
