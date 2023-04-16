import React from "react";
import "./userguide.css";

const UserGuide = () => {
  return (
    <div>
      <container className="MainContainer">
        <h1 className="MainTitle">For Applicants</h1>
      </container>
      <container className="MainContainer">
        <container className="StepOne">
          <h1 className="stepText">Step 1</h1>
          <h1 className="titleText">Create your free account</h1>
          <h1 className="descripText">
            All you need is an email and you are set to go! Don't forget to
            verify it at the end!
          </h1>
        </container>
        <container className="StepTwo">
          <h1 className="stepText">Step 2</h1>
          <h1 className="titleText">Build your profile</h1>
          <h1 className="descripText">
            Show yourself off to employers! The more you share the better you'll
            look to potential employers!
          </h1>
        </container>
        <container className="StepThree">
          <h1 className="stepText">Step 3</h1>
          <h1 className="titleText">Apply to job offers</h1>
          <h1 className="descripText">
            Put ourself out there, reach out and make yourself seen! Employers
            love engagement, so put some effort and strike out from the
            competition
          </h1>
        </container>
      </container>
    </div>
  );
};

export default UserGuide;
