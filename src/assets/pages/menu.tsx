import React from 'react';
import Nav from '../components/nav';
import Footer from '../components/footer';
import MenuView from '../components/menu';
import InitialPage from '../components/initialPage';

const about = () => {
    return (
        <div>
            <Nav />
                  <InitialPage
        line1="Welcome to Brooklin Pub"
        line2="Experience the finest dining and drinks in a cozy atmosphere."
      />
            <MenuView />
            <Footer />
        </div>
    )
}

export default about
