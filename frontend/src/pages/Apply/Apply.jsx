import React, { useEffect, useState } from "react";
import "./apply.css";
import company from "../../assets/apple.png";
import { useLocation } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import ApplicationAPIService from "./ApplicationAPIService";

const Apply = (props) => {
  const { contextState } = useUserContext();
  const [data, setData] = useState([{}]);
  const [defaultData, setDefaultData] = useState([{}]);
  const [er, setEr] = useState(false);
  const [errorString, setErrorString] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const { state } = useLocation();
  state.userContext = useUserContext();
  const { jobPostId } = state;

  useEffect(() => {
    fetch(`/getjob/${state.jobPostId}/`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setDefaultData(data);
        // console.log(data);
      })
      .catch(function (error) {
        console.log("empty db", error.toString());
        setErrorString(error.toString());
        setEr(true);
      });
  }, []);

  const submitApplication = async (event) => {
    event.preventDefault();

    await ApplicationAPIService.AddApplication({
      jobPostId: state.jobPostId,
      applicantUid: state.userContext.state.userData.uid,
      coverLetter,
    })
      .then((any) =>
        window.location.replace("http://localhost:3000/viewjobposts")
      )
      .catch((error) =>
        console.log("Following error occurred after fetching from API: ", error)
      );
  };

  const handleCoverLetterChange = (event) => {
    setCoverLetter(event.target.value);
  };

  function checkIfObjectNull(obj) {
    return obj != null ? obj : {};
  }

  return (
    <div>
      <container className="main_container">
        <container className="box">
          <h1 className="name">{data.title}</h1>
          <h1 className="jobtype">{`Job Type: ${data.jobtype}`}</h1>
          <h1 className="loca">{`Location: ${data.location}`}</h1>
          <h1 className="sal">{`Salary: ${data.salary}$`}</h1>
          <h1 className="tagg">{`Tags: ${data.tags}`}</h1>
          <h1 className="description">{`Description: ${data.description}`}</h1>
          <form className="formstyle" onSubmit={submitApplication}>
            <label>
              Your profile information will be sent to the employer, including
              your resume.
              <br /> You may inculde a cover letter.
            </label>

            <label htmlFor="resume-input">Upload Cover Letter</label>
            <textarea
              className="coverletter"
              id="cv-input"
              rows="100"
              cols="80"
              value={coverLetter}
              onChange={handleCoverLetterChange}
            />
            <input
              className="submitButton"
              type="submit"
              value="Submit Application"
            />
          </form>
        </container>
      </container>
    </div>
  );
};

export default Apply;
