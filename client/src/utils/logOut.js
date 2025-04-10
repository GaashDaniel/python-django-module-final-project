import { toast } from "react-toastify";
import guestUser from "../utils/guestUser";

export default function logOut(event, setUser, navigate) {
  event?.preventDefault();
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
  toast.success("Logged out successfully");
  setUser(guestUser);
  navigate("/");
}
