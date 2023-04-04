import React from 'react';
import {CustomerReview, EmployerGuide, Header} from '../../components';
import { UserGuide } from '../../components';
const Home = () => {
  return (
      <div>
      <Header />
      <UserGuide />
      <EmployerGuide />
      <CustomerReview />
      </div>

  );
};

export default Home;