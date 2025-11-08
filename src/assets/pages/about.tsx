import React from 'react';
import Nav from '../components/nav';
import Footer from '../components/footer';
import AboutUs from '../components/about-us';
import Gallery from '../components/gallery';
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
        <AboutUs/>
        <Gallery/>
        <Footer />
    </div>
  )
}

export default about
