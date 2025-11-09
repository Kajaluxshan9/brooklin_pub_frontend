import Nav from "../components/common/Nav";
import ChefSpecialDisplay from "../components/special/ChefSpecialDisplay";
import Footer from "../components/common/Footer";
import InitialPage from "../components/home/InitialPage";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";

const ChefSpecial = () => {
  return (
    <div>
      <Nav />
      <Callicon />
      <SocialMedia />
      <InitialPage
        line1="Welcome to Brooklin Pub"
        line2="Experience the finest dining and drinks in a cozy atmosphere."
      />
      <ChefSpecialDisplay />

      <Footer />
    </div>
  );
};

export default ChefSpecial;
