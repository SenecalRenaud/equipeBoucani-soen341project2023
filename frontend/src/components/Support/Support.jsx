import React from 'react'
import './support.css';
import logo1 from "../../assets/logo1_support.png";
import logo2 from "../../assets/logo2_support.png";
import logo3 from "../../assets/logo3_support.png";


const Support = () => {
  return (
      <div>

          <h1 className="title">Surrounded By Talent</h1>
            <h1 className="paragraph"> Over a Million companies looking for talent just like you. Find out why we've gained support of these amazing companies </h1>
            <container className="main_container">
                <container className="sub_container"><img  className="logos" src={logo1} alt="logo"/>
                    <h1 className='sauce'> Boucani goal in mind is to not only help users, but to help the world. That is also Fords higher purpose in life and so we support each other in achieving our goals. </h1>
                </container>
                <container className="sub_container"><img  className="logos" src={logo2} alt="logo"/>
                    <h1 className='sauce'> While disney may be the place of dreams and magic when we were kids, Boucani is the place where they are achieved as adults.</h1>
                </container>
                <container className="sub_container"><img  className="logos" src={logo3} alt="logo"/>
                <h1 className='sauce'> Nobody like our day one supporter LG. To us, they are role models of a greater future. Nothing makes us prouder then seeing our users ending up at a company like this!</h1>
                </container>

            </container>
          </div>



  )
}

export default Support