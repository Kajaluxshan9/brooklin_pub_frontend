import React from 'react';
import Nav from '../components/nav';
import ChefSpecial from "../components/chefSpecial";
import Footer from '../components/footer';
import InitialPage from '../components/initialPage';
import Callicon from '../components/calIcon';
import SocialMedia from '../components/SocialFloatingMenu'

const about = () => {
  return (
    <div>
      <Nav />
      <Callicon />
          <SocialMedia />
            <InitialPage
        line1="Welcome to Brooklin Pub"
        line2="Experience the finest dining and drinks in a cozy atmosphere."
      />
        <ChefSpecial />

        <Footer />
    </div>
  )
}

export default about
