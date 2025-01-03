import { useState, FormEvent } from "react";
import { login } from "../services/authServices";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useAuth } from "../Contexts/authContext";

interface User {
  id: string;
  name: string;
  role: string;
}
function Login() {
  const { setAuthUser } = useAuth();
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loginStatus, setLoginStatus] = useState<string>("");
  const [role, setRole] = useState<"superAdmin" | "siteAdmin">(
    "superAdmin"
  );
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(email, password, role);
      setLoginStatus("");
      if (user.status == 200) {
        const currentUser:User = {id:user.data.id, name: user.data.name, role: user.data.role}
        setLoginStatus("LoggedIn successfully");
        setAuthUser(currentUser);
        navigate("/employees");
      }
    } catch (error:any) {
      console.log(`Error while login: `, error.message);
      setLoginStatus(localStorage.getItem("loginStatus") || "Login failed");
    }
  };

  return (
    <>
      <h1 className="pagehead">Employee Work Tracking System</h1>
      <div className="main-login">
        <img
          src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?size=626&ext=jpg&ga=GA1.1.1581672273.1719949994&semt=ais_hybrid"
          alt="Login illustration"
        />
        <div className="login-container">
          <form onSubmit={handleSubmit}>
            <h2 className="form-title">Login</h2>
            <input
              className="input-field"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* User Type Selection */}
            <div className="role-selection">
              <label>
                <input
                  className="radiogroup"
                  type="radio"
                  value="superAdmin"
                  checked={role === "superAdmin"}
                  onChange={() => setRole("superAdmin")}
                />
                Super Admin
              </label>
              <label>
                <input
                  className="radiogroup"
                  type="radio"
                  value="siteAdmin"
                  checked={role === "siteAdmin"}
                  onChange={() => setRole("siteAdmin")}
                />
                Site Admin
              </label>
            </div>

            <button type="submit">Login as {role}</button>
          </form>
          <h3 className="loginStatus">{loginStatus}</h3>
        </div>
      </div>
    </>
  );
}

export default Login;
