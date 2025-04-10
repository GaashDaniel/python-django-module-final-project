import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import "../styles/Navbar.css";
import { blacklistToken } from "../services/userCrud";
import { toast } from "react-toastify";
import { TextField } from "@mui/material";
import UserAuthLevelIcon from "./UserAuthLevelIcon";

function Navbar({ user, setUser }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const setSearch = (search) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (search) newSearchParams.set("search", search);
    else newSearchParams.delete("search");
    setSearchParams(newSearchParams);
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("jwtRefresh");
    await blacklistToken(refreshToken);
    localStorage.removeItem("jwtAccess");
    localStorage.removeItem("jwtRefresh");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const openModal = (modalType) => {
    window.location.hash = modalType;
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          ArticleHub
        </NavLink>
      </div>
      <div>
        <TextField
          placeholder="Search..."
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div className="navbar__links">
        {user ? (
          <>
            <UserAuthLevelIcon user={user} />
            <button className="navbar__button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <UserAuthLevelIcon user={null} />
            <button
              className="navbar__button"
              onClick={() => openModal("register")}
            >
              Register
            </button>
            <button className="navbar__link" onClick={() => openModal("login")}>
              Login
            </button>
          </>
        )}
        {(user?.is_admin || user?.is_editor) && (
          <button
            className="navbar__button"
            onClick={() => openModal("create-new-article")}
          >
            Create new article
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
