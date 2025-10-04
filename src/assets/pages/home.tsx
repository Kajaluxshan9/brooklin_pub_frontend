import Nav from '../components/nav';
import Item from '../components/items';
import LandingPage from '../components/landingPage';
import Footer from '../components/footer';

const Home = () => {
  return (
    <div>
      <Nav />
      <LandingPage/>
        <Item /> 
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
