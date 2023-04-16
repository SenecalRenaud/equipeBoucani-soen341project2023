import React from "react";
import {
  CustomerReview,
  EmployerGuide,
  Header,
  Support,
  UserGuide,
} from "../../components";

const Home = () => {
  return (
    <div>
      <Header />
      <UserGuide />
      <EmployerGuide />
      <Support />
      <CustomerReview />
    </div>
  );
};

export default Home;
