import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className='footer-content'>
            <div className='footer-content-left'>
            <img src={assets.logo} alt="" />
            <p>Experience the best food delivery service with Haitatsu. Fresh, fast, and reliable - your favorite meals delivered to your doorstep.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />

            </div>
            </div>
            <div className='footer-content-center'>
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <div className='footer-content-right'>
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91 9999999999</li>
                <li>contact@Haitatsu.com</li>
            </ul>
            </div>

        </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 © haitatsu.com -All Right Reserved</p>
    </div>
  )
}

export default Footer
