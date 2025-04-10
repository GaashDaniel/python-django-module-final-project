import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { getUserToken } from "../../services/userCrud";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../../styles/Modal.css";

export default function LoginModal({ setUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const open = location.hash === "#login";
  const onClose = () => navigate(`${location.pathname}${location.search}`);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const [data, error] = await getUserToken({
      username,
      password,
    });
    if (error) return toast.error(error.detail);
    const { refresh, access } = data;
    localStorage.setItem("jwtRefresh", refresh);
    localStorage.setItem("jwtAccess", access);
    const user = jwtDecode(access);
    setUser(user);
    toast.success("Logged in successfully");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} className="modal-overlay">
      <Box className="modal">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <TextField
              name="username"
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div className="auth-options">
            <a
              href="#register"
              onClick={(event) => {
                event.preventDefault();
                navigate("#register");
              }}
            >
              Need an account? Register
            </a>
            <div>
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit">Login</button>
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
