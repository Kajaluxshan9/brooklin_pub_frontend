import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import AboutUs from "../components/about/AboutUs";
import Gallery from "../components/home/Gallery";
import InitialPage from "../components/home/InitialPage";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";
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
      <AboutUs />
      <Gallery />
      <Footer />
    </div>
  );
};

export default About;
