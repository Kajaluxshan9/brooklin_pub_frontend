import Nav from './nav';
import Item from './items';
import LandingPage from './landingPage';
import Footer from './footer';

const Home = () => {
  return (
    <div>
      <Nav />
      <LandingPage />
        <Item />
      <Footer />
    </div>
  );
};

export default Home;
