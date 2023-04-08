import React from 'react'
import './customerreview.css';
import worker from "../../assets/worker.jpg";


const CustomerReview = () => {
  return (
<div>
    <hr className='paddinghr'/>
     <container className="main_container">

       <container className="text_container">
           <h1>"</h1>
        <h1>This website is by far the best site I've come across in many years! It is easy to use, and the selection is incredible. It truely helped me find the place where I was meant to be.</h1>
           <h1>"</h1>
       </container>
       <container className="img_container">
            <img  className="imgborder" src={worker} alt="worker"/>
       </container>
     </container>
    <hr className='paddinghrbot'/>
    </div>

  )
}

export default CustomerReview