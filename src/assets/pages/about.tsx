import React from 'react';
import Nav from '../components/nav';
import Footer from '../components/footer';
import About from '../components/aboutus';
// import Menu from '../components/menulist'

const about = () => {
  return (
    <div>
      <Nav />
      <About />
      {/* <Menu /> */}
      <Footer />
    </div>
  )
}

export default about
