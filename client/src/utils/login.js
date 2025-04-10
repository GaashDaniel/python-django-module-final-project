import { jwtDecode } from "jwt-decode";
import { getUserById, getUserToken } from "../services/userCrud";

export default async function login({ email, password, setUser }) {
  var { error, jwtToken } = await getUserToken({ email, password });
  if (error) return { error };
  localStorage.setItem("jwtToken", jwtToken);
  const userMetadata = jwtDecode(jwtToken);
  var { error, user } = await getUserById(userMetadata._id);
  if (error) return { error };
  user.loggedIn = true;
  localStorage.setItem("user", JSON.stringify(user));
  setUser(user);
  return { error };
}
