import React from 'react';
import Nav from '../components/nav';
import Special from "../components/special";
import Footer from '../components/footer';
import Menu from '../components/menulist';
import About from '../components/menu';
import AboutUs from '../components/about-us';
import Gallery from '../components/gallery';

const about = () => {
  return (
    <div>
      <Nav />
        {/* <Special /> */}
        {/* <Menu /> */}
        {/* <About/> */}
        <AboutUs/>
        <Gallery/>
        <Footer />
    </div>
  )
}

export default about
