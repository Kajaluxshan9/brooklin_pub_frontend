import Nav from "../components/common/Nav";
import MainMenu from "../components/menu/MainMenu";
import Footer from "../components/common/Footer";
import InitialPage from "../components/home/InitialPage";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";

const Special = () => {
  return (
    <div>
      <Nav />
      <Callicon />
      <SocialMedia />
      <InitialPage
        line1="Welcome to Brooklin Pub"
        line2="Experience the finest dining and drinks in a cozy atmosphere."
      />
      <MainMenu />
      <Footer />
    </div>
  );
};

export default Special;
