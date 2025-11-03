import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, userId } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: '',
    lastName: '', 
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    // Prepare order items
    let orderItems = [];
    food_list.forEach(item => {
      if (cartItems[item._id] > 0) {
        orderItems.push({ ...item, quantity: cartItems[item._id] });
      }
    });

    if (orderItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    // Prepare order data
    const orderData = {
      userId,
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2
    };

    try {
      // Call backend to create Razorpay order
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token }
      });

      
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Failed to load Razorpay SDK. Check your connection.");
        return;
      }

      const { orderId, amount, currency, key,dbOrderId } = response.data;

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "Haitatsu Food",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (paymentResult) {
          try {
            // verify payment on backend (updates DB)
            const verifyRes = await axios.post(`${url}/api/order/verify`, {
              razorpay_order_id: paymentResult.razorpay_order_id,
              razorpay_payment_id: paymentResult.razorpay_payment_id,
              razorpay_signature: paymentResult.razorpay_signature,
              orderId: orderId,
              dbOrderId: dbOrderId
            }, {
              headers: { token }
            });

            if (verifyRes.data?.success) {
              alert("Payment successful and verified");
              navigate('/myorders');
            } else {
              alert("Payment succeeded but verification failed");
              navigate('/');
            }
          } catch (err) {
            console.error('verify error', err);
            alert('Error verifying payment');
            navigate('/');
          }
        },
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone
        },
        theme: { color: "#3399cc" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log(error);
      alert("Error in placing order");
    }
  };
  const navigate =useNavigate();
  useEffect(() => {
    if(!token){
      navigate('/cart')
    }else if(getTotalCartAmount()===0){
      navigate('/cart')
    }
  },[token])

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} type="text" value={data.firstName} placeholder='First name' />
          <input required name='lastName' onChange={onChangeHandler} type="text" value={data.lastName} placeholder='Last name' />
        </div>
        <input required name='email' onChange={onChangeHandler} type="email" value={data.email} placeholder='Email' />
        <input required name='street' onChange={onChangeHandler} type="text" value={data.street} placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} type="text" value={data.city} placeholder='City' />
          <input required name='state' onChange={onChangeHandler} type="text" value={data.state} placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipCode' onChange={onChangeHandler} type="text" value={data.zipCode} placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} type="text" value={data.country} placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} type="text" value={data.phone} placeholder='Phone number' />
      </div>

      <div className="place-order-right">
        <div className='cart-total'>
          <h2> Cart Total</h2>
          <div>
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type='submit'>Proceed to Payment</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
