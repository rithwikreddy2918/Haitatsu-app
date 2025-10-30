import React,{ useState } from 'react'
import NavBar from './components/NavBar/NavBar'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Cart from './pages/cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopUp/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/myOrders/myOrders'
const App = () => {
  const [showLogin,setShowLogin] = useState(false)
  return (<>
  {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className="App">
      <NavBar  setShowLogin={setShowLogin}/>
      <Routes>
        <Route path='/' element={<Home/>}/>
         <Route path='/cart' element={<Cart/>}/>
          <Route path='/order' element={<PlaceOrder/>}/>
           <Route path='/verify' element={<Verify/>}/>
           <Route path='/myorders' element={<MyOrders/>}/>
        </Routes>
    </div>
    <Footer/>
    </>
  )
}

export default App
