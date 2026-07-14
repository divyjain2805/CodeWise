import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { registeruser } from "../services/auth.service";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [loading, setloading] = useState(false);

  async function handlesubmit(e) {
    e.preventDefault();

    if (password !== confirmpassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setloading(true);

      const data = await registeruser({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      console.log("Response:", data);

      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      console.log("Error:", error.response || error);
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setloading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Create Account</h2>
          <form onSubmit={handlesubmit} className="space-y-4">
            <input required type="text" placeholder="Username"
              className="input input-bordered w-full"
              value={username} onChange={(e) => setUsername(e.target.value)} />
            <input required type="email" placeholder="Email"
              className="input input-bordered w-full"
              value={email} onChange={(e) => setemail(e.target.value)} />
            <input required type="password" placeholder="Password"
              className="input input-bordered w-full"
              value={password} onChange={(e) => setpassword(e.target.value)} />
            <input required type="password" placeholder="Confirm Password"
              className="input input-bordered w-full"
              value={confirmpassword} onChange={(e) => setconfirmpassword(e.target.value)} />
            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="text-center">
            Already have an account?
            <Link to="/login" className="link link-primary ml-1">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
