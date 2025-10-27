import React from 'react';
import Nav from '../components/nav';
import Footer from '../components/footer';
import AboutUs from '../components/about-us';
import Gallery from '../components/gallery';

const about = () => {
  return (
    <div>
      <Nav />
        <AboutUs/>
        <Gallery/>
        <Footer />
    </div>
  )
}

export default about
