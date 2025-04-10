import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { registerUser } from "../../services/userCrud";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../../styles/Modal.css";

export default function RegisterModal({ setUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const open = location.hash === "#register";
  const onClose = () => navigate(`${location.pathname}${location.search}`);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const [data, error] = await registerUser({
      username,
      password,
    });

    if (error) return toast.error(Object.values(error).flat().join(" "));
    const { refresh, access } = data;
    localStorage.setItem("jwtAccess", access);
    localStorage.setItem("jwtRefresh", refresh);
    const user = jwtDecode(access);
    setUser(user);
    toast.success("Registered successfully");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} className="modal-overlay">
      <Box className="modal">
        <h2>Register</h2>
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
              href="#login"
              onClick={(event) => {
                event.preventDefault();
                navigate("#login");
              }}
            >
              Already have an account? Login
            </a>
            <div>
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit">Register</button>
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
