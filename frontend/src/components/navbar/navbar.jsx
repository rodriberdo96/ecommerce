import React, { useRef } from 'react'
import './navbar.css'
import logo from '../assets/logo.png'
import cart_icon from '../assets/cart_icon.png'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../../../../frontend/src/context/shopcontext'
import dropdown_icon from '../assets/dropdown_icon.png'

    const Navbar = () => {
      const[menu, setMenu] = useState("shop")
      const {getTotalCartItems}=useContext(ShopContext);
      const menuRef=useRef();
      const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
      }

  return (
    <div className='navbar'>
      <div className="nav-logo">
        <Link  to='/'><img src={logo} alt="" /></Link>
        <p>Shopper</p>
      </div>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={dropdown_icon} alt="" />
            <ul ref={menuRef} className='nav-menu'>
              <li onClick={()=> {setMenu("shop")}}><Link style={{textDecoration:'none', color:'#626262'}} to='/'>Shop</Link> {menu==="shop"?<hr/>:<></>}</li>
              <li onClick={()=> {setMenu("mens")}}><Link style={{textDecoration:'none', color:'#626262'}} to='/mens'>Men</Link>  {menu==="mens"?<hr/>:<></>}</li>
              <li onClick={()=> {setMenu("womens")}}><Link style={{textDecoration:'none', color:'#626262'}} to='/womens'> Women</Link>  {menu==="womens"?<hr/>:<></>}</li>
              <li onClick={()=> {setMenu("kids")}}> <Link style={{textDecoration:'none', color:'#626262'}} to='/kids'>Kids</Link> {menu==="kids"?<hr/>:<></>}</li>
            </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token')?<button onClick={()=>{localStorage.removeItem('auth-token'); window.location.replace('/')}}>Logout</button>:
        <Link to='/login'><button>Login</button></Link>}

      <Link to='/cart'><img src={cart_icon} alt="" /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  )
}
export default Navbar