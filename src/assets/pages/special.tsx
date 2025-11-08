import React from 'react';
import Nav from '../components/nav';
import Special from "../components/special";
import Footer from '../components/footer';
import InitialPage from '../components/initialPage';
import Callicon from '../components/calIcon';
import SocialMedia from '../components/SocialFloatingMenu';

const About = () => {
  return (
    <div>
      <Nav />
      <Callicon />
          <SocialMedia />
      <InitialPage
        line1="Welcome to Brooklin Pub"
        line2="Experience the finest dining and drinks in a cozy atmosphere."
      />
      <Special />
      <Footer />
    </div>
  );
};

export default About;
