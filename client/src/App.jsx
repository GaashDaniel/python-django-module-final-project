import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar";
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";
import LoginModal from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";
import Article from "./pages/Article";
import CreateNewArticleModal from "./components/modals/CreateNewArticleModal";
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState(function loadUser() {
    const token = localStorage.getItem("jwtAccess");
    if (!token) return null;
    return jwtDecode(token);
  });

  const location = useLocation();
  useEffect(() => {
    scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return (
    <>
      <Navbar {...{ user, setUser }} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:articleId" element={<Article user={user} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <ToastContainer position="bottom-left" autoClose={3000} />
      <LoginModal setUser={setUser} />
      <RegisterModal setUser={setUser} />
      <CreateNewArticleModal />
      <Footer />
    </>
  );
}

export default App;
