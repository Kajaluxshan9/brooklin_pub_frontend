import React from 'react';
import Nav from '../components/nav';
import Footer from '../components/footer';
import AboutUs from '../components/about-us';
import Gallery from '../components/gallery';
import InitialPage from '../components/initialPage';

const about = () => {
  return (
    <div>
      <Nav />
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
