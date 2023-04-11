import React from 'react'
import './footer.css';
import instagram from "../../assets/insta.png";
import facebook from "../../assets/facebook.png";
import twitter from "../../assets/twitter.png";
import linkedin from "../../assets/linkedin.png";
import youtube from "../../assets/yt.png";
import mtl from "../../assets/mtl.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCity} from "@fortawesome/free-solid-svg-icons";



const Footer = () => {
  return (
    <container className='bigFoot'>

      <container className='links'>
          <a href='https://www.instagram.com/'><img  className="instagram" src={instagram} alt="instagram"/></a>
          <a href='https://www.facebook.com/'><img  className="facebook" src={facebook} alt="facebook"/></a>
          <a href='https://twitter.com/'><img  className="twitter" src={twitter} alt="twitter"/></a>
          <a href='https://www.linkedin.com/in/jackspiratos/'><img  className="linkedin" src={linkedin} alt="linkedin"/></a>
          <a href='https://www.youtube.com/'><img  className="youtube" src={youtube} alt="youtube"/></a>
      </container>
      <container className='info'>
          <h1>+1 800 999 9999</h1>
          <h1>Boucani@gmail.com</h1>
          <h1>Born in Montreal <FontAwesomeIcon icon={faCity} style={{color: "#ffffff",}} /> </h1>
      </container>
    </container>

  )
}

export default Footer