import React from 'react'
import './header.css';
import people from '../../assets/people.png'
import ai from '../../assets/ai.png'
import jobsearch from '../../assets/jobsearch.png'

const Header = () => {
  return (
    <div className='gpt3__header section__padding' id='home'>

        <div className="gpt3__header-content">
          <h1 className="gradient__text">Find the dream job for you with Boucani</h1>
          <p>“Success is not final, failure is not fatal, it is the courage to continue that counts.” — Winston Churchill</p>

          <div className="gpt3__header-content__input">
          <input type="email" placeholder="Your Email Address" />
          <button type="button">Get Started</button>
          </div>

          <div className="gpt3__header-content__people">
          <img src={people} alt="people"/>
          <p>1600 people requested access a visit in last 24 hours</p>
          </div>
      </div>

      <div className="gpt3__header-image">
        <img src={jobsearch} />
      </div>

    </div>

    
  )
}

export default Header