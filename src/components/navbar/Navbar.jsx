import React, { useState } from 'react'
import { RiMenu3Line, RiCloseLin, RiCloseLine } from 'react-icons/ri'; //icons??
import './navbar.css';
import logo from '../../assets/logo.svg';
import logo2 from '../../assets/logo2.png';

const Menu = () => (
  <>
  <p><a href="#home">Home</a></p>
  <p><a href="#possibility">Job Postings</a></p>
  <p><a href="#wgpt3">What is Boucani?</a></p>
   <p><a href="#blog">Profile</a></p>
  </>
)

const Navbar = () => {
  //make it false in beggining, since it will cahnge to true when true
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <div className='gpt3__navbar'>

      <div className='gpt3__navbar-links'>

        <div className='gpt3__navbar-links_logo'> 
          <img src={logo2} alt="logo"/>
        </div>

        <div className='gpt3__navbar-links_container'>
          <Menu />
        </div>

      </div>

      <div className="gpt3__navbar-sign">
        <p>Sign in</p>
        <button type="button">Sign up</button>

      </div>
      {'this is for the mobile part'} 

      <div className='gpt3__navbar-menu'>
      {toggleMenu
          ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
          {toggleMenu && (
        <div className="gpt3__navbar-menu_container scale-up-center">
          <div className="gpt3__navbar-menu_container-links">
          <Menu />
          </div>
          <div className="gpt3__navbar-menu_container-links-sign">
            <p>Sign in</p>
            <button type="button">Sign up</button>
          </div>
        </div>
        )}
      </div>
      
      
    </div>
  )
}

export default Navbar