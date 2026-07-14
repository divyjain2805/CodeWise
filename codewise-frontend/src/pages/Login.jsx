import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { loginuser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);

  async function handlesubmit(e) {
    e.preventDefault();

    try {
      setloading(true);

      const data = await loginuser({
        email: email.trim(),
        password,
      });

      console.log(data);

      alert("Login Successful");

      await refresh();
      navigate("/");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setloading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">

      <div className="card w-96 bg-base-100 shadow-xl">

        <div className="card-body">

          <h2 className="card-title justify-center">
            Login
          </h2>

          <form onSubmit={handlesubmit} className="space-y-4">

            <input
              required
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />

            <input
              required
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />

            <button
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="text-center">

            Don't have an account?

            <Link
              to="/register"
              className="link link-primary ml-1"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
