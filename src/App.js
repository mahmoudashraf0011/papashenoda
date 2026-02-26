import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header/Header";
import NotFound from "./components/NotFound/NotFound";
import Footer from "./components/Footer/Footer";
import "./App.css";
import Home from "./Pages/Home/Home";
import Contact from "./components/Contact/Contact";
import About from "./components/About/About";
import Happen from "./components/Happen/Happen";
import WritingsPage from "./Pages/Media/Writings/WritingsPage";
import SayingsPage from "./Pages/Media/Writings/Sayings/SayingsPage";
import PoemsPage from "./Pages/Media/Writings/Poems/PoemsPage";
import DocsPage from "./Pages/Media/Writings/Docs/DocsPage";

import Aboutpapa from "./components/AboutPapa/Aboutpapa";
import Books from "./components/Books/Books";
import Videos from "./components/Videos/Videos";
import DisplayVideo from "./components/Videos/DisplayVideo";
import ArticlesPage from "./Pages/Media/Writings/Articles/ArticlesPage";
import QuestionsPage from "./Pages/Media/Writings/Questions/QuestionsPage";
import SayingFilterPage from "./Pages/Media/Writings/Sayings/SayingFilterPage";
import OnePoemPage from "./Pages/Media/Writings/Poems/OnePoemPage";
import OneArticlePage from "./Pages/Media/Writings/Articles/OneArticlePage";
import DocsFilterPage from "./Pages/Media/Writings/Docs/DocsFilterPage";
import ArticlesFilterPage from "./Pages/Media/Writings/Articles/ArticlesFilterPage";
import SoundsPage from "./Pages/Media/Sounds/SoundsPage";
import SoundsFavPage from "./Pages/Media/Sounds/SoundsFavPage";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Gallery from "./components/Gallery/Gallery";
import DisplayGallery from "./components/Gallery/DisplayGallery";
import Visits from "./components/Visits/Visits";
import Topic from "./components/Happen/Topic";
import ForgetPassPage from "./Pages/Auth/ForgetPassPage";
import RestPassPage from "./Pages/Auth/RestPassPage";
import CategoryPage from "./Pages/Category/CategoryPage";
import CategoryMorePage from "./Pages/Category/CategoryMorePage";
import SearchPage from "./Pages/Search/SearchPage";
import SearchMorePage from "./Pages/Search/SearchMorePage";
import ProfileAcouantPage from "./Pages/Profile/ProfileAccountPage";
import ProfileBookmarkPage from "./Pages/Profile/ProfileBookmarkPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import DisplayBook from "./components/Books/DisplayBook";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VideoPlayerPage from "./components/Videos/VideoPlayerPage";

function App() {
  useEffect(() => {
    const spinner = document.getElementById("global-spinner");
    if (spinner) {
      spinner.style.display = "none"; // hide after react loaded
    }
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}
function AppContent() {
  const location = useLocation();

  // Check if the current route is not '/checkout'
  const showFooter =
    location.pathname !== "/media/audio" &&
    location.pathname !== "/profileBookMark" &&
    location.pathname !== "/profileAccount" &&
    !location.pathname.startsWith("/displayBook/") &&
    !/^\/articles\/\d+$/.test(location.pathname) &&
    !location.pathname.startsWith("/video-player/");

  const showHeader =
    !location.pathname.startsWith("/displayBook/") &&
    !location.pathname.startsWith("/video-player/");

  useEffect(() => {
    // Dynamically manage styles based on route
    let style = document.getElementById("custom-scrollbar-style");

    if (
      location.pathname === "/media/books" ||
      location.pathname === "/displayBook" ||
      /^\/articles\/\d+$/.test(location.pathname)
    ) {
      if (!style) {
        style = document.createElement("style");
        style.id = "custom-scrollbar-style";
        style.textContent = `
          html::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
            display: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      if (style) {
        style.remove();
      }
    }

    // check Route Path
    const targetPathWrite = "/media/written-quotes-more";
    if (location.pathname !== targetPathWrite) {
      localStorage.removeItem("countSW");
    }
    const targetPathPhoto = "/media/pictures-and-sayings";
    if (location.pathname !== targetPathPhoto) {
      localStorage.removeItem("countSP");
    }
    const targetPathArticlesNews = "/articals/";
    if (location.pathname !== targetPathArticlesNews) {
      localStorage.removeItem("countArticlesNews");
    }
    const targetPathPoems = "/media/poems";
    if (location.pathname !== targetPathPoems) {
      localStorage.removeItem("countPoems");
    }
    const targetPathQues = "/media/questions-answers";
    if (location.pathname !== targetPathQues) {
      localStorage.removeItem("countQues");
    }
    const targetPathSearch = "/search/more/";
    if (location.pathname !== targetPathSearch) {
      localStorage.removeItem("countSearch");
    }
    const targetPathDisplayBook = "/displayBook";
    if (location.pathname !== targetPathDisplayBook) {
      localStorage.removeItem("countSearch");
    }
    const targetPathVideos = "/media/video";
    if (location.pathname !== targetPathVideos) {
      localStorage.removeItem("countVideo");
    }

    //for filter search
    if (location.pathname !== targetPathSearch) {
      localStorage.removeItem("filterSearch");
    }
  }, [location.pathname]);
  return (
    <>
      <GoogleOAuthProvider clientId="883456347462-4hnm74bg7176dem36vokj95hc3kp5d0q.apps.googleusercontent.com">
        {showHeader && <Header />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/happen" element={<Happen />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route
            path="/category/:id/more/:mediaID"
            element={<CategoryMorePage />}
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search/more/:id" element={<SearchMorePage />} />
          <Route path="/media/writings" element={<WritingsPage />} />
          <Route path="/media/written-quotes" element={<SayingsPage />} />
          <Route path="/media/:id" element={<SayingFilterPage />} />
          <Route path="/media/poems" element={<PoemsPage />} />
          <Route path="/poems/:id" element={<OnePoemPage />} />
          <Route path="/media/documents" element={<DocsPage />} />
          <Route path="/docs/:id" element={<DocsFilterPage />} />
          <Route path="/media/article" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<OneArticlePage />} />
          <Route path="/articals/:newspaper" element={<ArticlesFilterPage />} />
          <Route path="/media/questions-answers" element={<QuestionsPage />} />
          <Route path="/media/audio" element={<SoundsPage />} />
          <Route path="/sounds/:title" element={<SoundsFavPage />} />
          <Route path="/aboutpapa" element={<Aboutpapa />} />
          <Route path="/media/books" element={<Books />} />
          <Route path="/displayBook/:id" element={<DisplayBook />} />
          <Route path="/media/video" element={<Videos />} />
          <Route path="/displayvideo/:id" element={<DisplayVideo />} />

          <Route path="/video-player/:id" element={<VideoPlayerPage />} />

          <Route path="/gallerymedia/:id" element={<Visits />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetPassword" element={<ForgetPassPage />} />
          <Route path="/reset-password" element={<RestPassPage />} />
          <Route path="/media/event-gallery" element={<Gallery />} />
          <Route path="/displaygallery" element={<DisplayGallery />} />
          <Route path="/visits" element={<Visits />} />
          <Route path="/happen/:id" element={<Topic />} />
          <Route path="/happen" element={<Happen />} />
          <Route path="/profileAccount" element={<ProfileAcouantPage />} />
          <Route path="/profileBookMark" element={<ProfileBookmarkPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {showFooter && <Footer />}
      </GoogleOAuthProvider>

      <ToastContainer position="top-right" rtl autoClose={3000} />
    </>
  );
}

export default App;
