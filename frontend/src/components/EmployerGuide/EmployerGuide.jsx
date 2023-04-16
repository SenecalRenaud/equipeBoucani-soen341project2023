import React from "react";
import "./employerguide.css";

const EmployerGuide = () => {
  return (
    <div>
      <container className="MainContainer">
        <h1 className="MainTitle">For Employers</h1>
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
          <h1 className="titleText">Build your Hiring Post</h1>
          <h1 className="descripText">
            All you need are a few specifications, such as a name, location, job
            type and a small description. It couldn't be easier
          </h1>
        </container>
        <container className="StepThree">
          <h1 className="stepText">Step 3</h1>
          <h1 className="titleText">Post it!</h1>
          <h1 className="descripText">
            Once your done you can just post it and we'll take care of the rest.
            You'll receive emails and info on the interested candidates!
          </h1>
        </container>
      </container>
    </div>
  );
};

export default EmployerGuide;
