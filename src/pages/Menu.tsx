import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import MenuView from "../components/menu/MenuDisplay";
import InitialPage from "../components/home/InitialPage";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";

const Menu = () => {
  return (
    <div>
      <Nav />
      <Callicon />
      <SocialMedia />
      <InitialPage
        line1="Welcome to Brooklin Pub"
        line2="Experience the finest dining and drinks in a cozy atmosphere."
      />
      <MenuView />
      <Footer />
    </div>
  );
};

export default Menu;
