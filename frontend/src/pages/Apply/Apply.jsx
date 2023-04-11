import React from 'react';
import './apply.css';
import company from "../../assets/apple.png";


const Apply = () => {
    let coverletter;
    let resumeType;
    return (
      <div>
        <container className='main_container'>
            <container className='box'>
            <img  className="img_logo" src={company} alt="banner"/>
                <h1 className='name'>Company Name</h1>
                <h1 className='description'>This is a nice description of the company you are applying to, just to make sure that you understand what kind of company you will be applying to if you didnt read the previous discription</h1>
                <form className='formstyle'>
                        <label>First Name</label>
                        <input  type="text" id="fname" name="firstname" placeholder="Your name.."/>
                        <label htmlFor="lname">Last Name</label>
                        <input  type="text" id="lname" name="lastname" placeholder="Your last name.."/>
                        <label htmlFor="resume-input">Upload Resume</label>
                        <input
                            class='resume'
                            id="resume-input"
                            type="file"

                        />
                        <label htmlFor="resume-input">Upload Cover Letter</label>
                        <input
                            class='coverletter'
                            id="cv-input"
                            type="file"

                        />
                </form>
            </container>


        </container>
      </div>

  );
};

export default Apply;