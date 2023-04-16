import React, { useState } from "react";
import "./SignUpForm.css";
import CommentAPIService from "../BACKEND_DEBUG/CommentAPIService";
import { useUserContext } from "../../context/UserContext";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const SignUpForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [userType, setUserType] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [resumeType, setResumeType] = useState("Resume");

  const { dispatch } = useUserContext();

  const [loading, setLoading] = useState(false);

  const handleProfilePictureChange = (event) => {
    setProfilePicture(event.target.files[0]);
    if (event.target.files[0]) {
      setPreviewImage(URL.createObjectURL(event.target.files[0]));
    } else {
      setPreviewImage(null);
    }
  };

  const validatePassword = () => {
    const regex = /^(?=(?:.*[a-zA-Z]){4,})(?=(?:.*\d){2,}).{6,}$/;
    if (!regex.test(password)) {
      setErrorMessage(
        "Password must be at least 6 characters long and contain at least 2 digits."
      );
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validatePassword()) {
      setLoading(true);
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("userType", userType);
      formData.append("profilePicture", profilePicture);
      formData.append("uploadedResume", uploadedResume);

      CommentAPIService.AddNewUser(formData).then(
        (r) => CommentAPIService.UserSignIn(dispatch, formData) //dispatch i.e. reducerDispatch
      );
    }
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="sign-up-container">
          <h1>Sign Up</h1>
          <form onSubmit={(event) => handleSubmit(event)}>
            <label htmlFor="first-name-input">First Name</label>
            <input
              id="first-name-input"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />

            <label htmlFor="last-name-input">Last Name</label>
            <input
              id="last-name-input"
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />

            <label htmlFor="email-input">Email</label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <label htmlFor="confirm-password-input">Confirm Password</label>
            <input
              id="confirm-password-input"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />

            <label htmlFor="profile-picture-input">
              Upload Profile Picture
            </label>
            <input
              id="profile-picture-input"
              type="file"
              onChange={handleProfilePictureChange}
            />

            {previewImage && (
              <div className="profile-picture-preview">
                <img src={previewImage} alt="Profile Preview" />
              </div>
            )}

            <label htmlFor="resume-input">Upload {resumeType}</label>
            <input
              id="resume-input"
              type="file"
              onChange={(event) => {
                setUploadedResume(event.target.files[0]);
              }}
            />

            <label htmlFor="user-type-select">User Type</label>
            <select
              id="user-type-select"
              value={userType}
              onChange={(event) => {
                setUserType(event.target.value);
                switch (event.target.value) {
                  case "Employer":
                    setResumeType("Company's Resume");
                    break;
                  case "Admin":
                    setResumeType("Administration request document");
                    break;
                  case "Applicant":
                  default:
                    setResumeType("Resume");
                }
              }}
              required
            >
              <option value="">Select a user type</option>
              <option value="Applicant">Student/Applicant</option>
              <option value="Employer">Employer</option>
              <option value="Admin">Admin</option>
            </select>

            <button className="sign-up-button" type="submit">
              Create Account !
            </button>
          </form>
        </div>
      )}
      ;
    </>
  );
};

export default SignUpForm;
