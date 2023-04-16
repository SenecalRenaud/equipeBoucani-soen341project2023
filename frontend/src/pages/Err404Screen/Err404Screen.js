import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import * as reactSpinners from "react-spinners";
const PageNotFound = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  console.log();

  const navbarEl = document.getElementsByClassName("gpt3__navbar")[0];
  if (navbarEl === undefined) {
    return <></>;
  } else if (!isFullScreen) {
    navbarEl.classList.add("hidden");
    setIsFullScreen(true);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(45deg, #FF4820, #4d4dff)",
        backdropFilter: "blur(5px)",
      }}
    >
      <reactSpinners.PacmanLoader
        size={45}
        loading={true}
        color={"rgb(255, 138, 113)"}
      />
      <h1 style={{ color: "#031B34", fontSize: "6rem", marginBottom: "1rem" }}>
        404
      </h1>
      <p
        style={{
          color: "#FF8A71",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "2rem",
        }}
      >
        Page Not Found
      </p>
      <Link
        onClick={(e) => {
          navbarEl.classList.remove("hidden");
          setIsFullScreen(false);
        }}
        style={{
          background: "#042c54",
          color: "#FF8A71",
          padding: "1rem 2rem",
          border: "none",
          borderRadius: "4px",
          fontSize: "1.5rem",
          cursor: "pointer",
        }}
        to="/"
      >
        Go Back Home{" "}
      </Link>
      <p style={{ color: "#040C18", marginTop: "2rem", fontStyle: "italic" }}>
        Sorry, the page you are looking for could not be found.
      </p>
    </div>
  );
};

export default PageNotFound;
