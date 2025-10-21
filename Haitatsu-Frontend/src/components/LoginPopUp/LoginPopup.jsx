import React,{useState} from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'

const LoginPopup = ({setShowLogin}) => {
  const {url,setToken}=useContext(StoreContext);
    const[currState,setCurrState]=useState("Login")
    const [data,setData]=useState({
      name:"",
      email:"",
      password:""
    })
     const onChangeHandler=(event)=>{
      const name=event.target.name;
      const value=event.target.value;
      setData(data=>({...data,[name]:value}));
     }
     const onLogin=async(event)=>{
      event.preventDefault();
      let newUrl=url;
      if(currState==="Login"){
        newUrl +="/api/user/login";
      }else{
        newUrl +="/api/user/register";
        
      }
      const response=await axios.post(newUrl,data);
      if(response.data.success){
        setToken(response.data.token);
        localStorage.setItem("token",response.data.token);
        setShowLogin(false);
      }else{
        alert(response.data.message);
      }
     }
  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs" >
            {currState==="Login" ?<></>: <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Enter your name' required />}
            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Enter your email' required />
            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Enter your password' required  />
        </div>
       
      <div className="login-popup-cond">
        <input type="checkbox" required/>
        <p>I agree to the terms and conditions of the privacy policy</p>
         
      </div>
      <button type='submit' >{currState==="Sign Up"?"Create account":"Login"}</button>
      {currState==="Login" ?<p onClick={()=>setCurrState("Sign Up")}>Create a new account ? <span>Click here</span></p>
      : <p onClick={()=>setCurrState("Login")}>Already have an account ? <span>Login here</span></p>}

      </form>
    </div>
  )
}

export default LoginPopup
