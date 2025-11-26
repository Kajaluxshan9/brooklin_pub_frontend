import Nav from "../components/common/Nav";
import SpecialDisplay from "../components/special/SpecialDisplay";
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
      <SpecialDisplay initialShowChef={true} />

      <Footer />
    </div>
  );
};

export default ChefSpecial;
