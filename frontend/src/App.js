import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation } from "react-router-dom";
import BackToTopButton from "./components/common/BackToTopButton";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";
import { HomeTwo, HomeThree, About, AboutTwo, Services, ServicesTwo, Property, PropertyTwo, PropertyThree, PropertyFour, PropertyFive, PropertySix, Blog, BlogTwo, BlogThree, BlogFour, Contact, Portifolio, PortifolioTwo, Team, Faqs, PageNotFound, Home,PropertyDetails,Profile } from "./pages";
import Dropdown from "./components/common/DropDown";
import NewsLetter from "./components/common/NewsLetter";
import Loader from "./components/common/Loader";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import { closeDropdown } from "./store/Slices/uiSlice";
import PublicRoute from "./Guard/PublicRoute";
import { appAxios } from "./services/appAxios";
import { logout } from "./store/Slices/authSlice";
import { toastNotification } from "./components/CustomToast/CustomToast";
import PrivateRoute from "Guard/PrivateRoute";
function App() {
  const location = useLocation();
  const [showButton, setShowButton] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const isToken = useSelector((state) => state.auth.isToken);
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const darkMode = useSelector((state) => state.ui.darkMode);
  const dispatch = useDispatch();
  const route = useLocation();

  // Show/Hide scroll to top button
  window.addEventListener("scroll", () => {
    window.scrollY > 500 ? setShowButton(true) : setShowButton(false);
  });

  const handleCloseDropdown = (e) => {
    dispatch(closeDropdown());
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  // Loader when page is loading
  window.addEventListener("load", () => {
    setShowLoader(false);
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (isToken && user && isLoggedIn) {
        try {
          const response = await appAxios.get('/auth/check');
          if (response.status !== 200) {
            if(darkMode){
              toastNotification.infoLight("Session timed out");
            }else{
              toastNotification.infoDark("Session timed out");
            }
            dispatch(logout());
          }
        } catch (error) {
          console.log('Error checking auth status:', error);
          if(darkMode){
            toastNotification.infoLight("Session timed out");
          }else{
            toastNotification.infoDark("Session timed out");
          }
          // dispatch(logout());
        }
      }
    };
    checkAuthStatus();
  }, [isToken,user,isLoggedIn]);

  return (
    <div>
      {showLoader && <Loader />}
      <Navbar />
      <Dropdown />
      <div
        className={`min-h-screen ${location && location.pathname === '/profile' ? '' : 'pb-40' }`}
        onClick={handleCloseDropdown}
        onMouseOver={() => dispatch(closeDropdown())}
      >
        <Routes>
          <Route path="/" element={<HomeTwo />} />
          <Route path="/home-2" element={<Home />} />
          <Route path="/home-3" element={<HomeThree />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/about-2" element={<AboutTwo />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services-2" element={<ServicesTwo />} />
          <Route path="/property" element={<Property />} />
          <Route path="/property-2" element={<PropertyTwo />} />
          <Route path="/property-3" element={<PropertyThree />} />
          <Route path="/property-4" element={<PropertyFour />} />
          <Route path="/property-5" element={<PropertyFive />} />
          <Route path="/property-6" element={<PropertySix />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/search" element={<PropertySix />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog-2" element={<BlogTwo />} />
          <Route path="/blog-3" element={<BlogThree />} />
          <Route path="/blog-4" element={<BlogFour />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portifolio" element={<Portifolio />} />
          <Route path="/portifolio-2" element={<PortifolioTwo />} />
          <Route path="/team" element={<Team />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      {location && (location.pathname === '/signin' || location.pathname === '/signup') ? null : (
      <div className="px-[2%] md:px-[6%] bg-card-dark border border-card-dark">
       {location && (location.pathname === '/profile') ? null : <NewsLetter />}
        <div className="mt-20">
          <Footer />
        </div>
      </div>
      )}
      <BackToTopButton showButton={showButton} />
    </div>
  );
}

export default App;
