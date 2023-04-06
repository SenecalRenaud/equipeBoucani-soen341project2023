import React from 'react';
import './jobposting.css';
import worker from "../../assets/banner_jobposting.png";

const Home = () => {
  return (
      <div>
        <container className='main_banner'>
            <h1 ></h1>
            <img  className="imgbanner" src={worker} alt="banner"/>

        </container>
      </div>

  );
};

export default Home;