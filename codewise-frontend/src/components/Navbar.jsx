import { Link, NavLink, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const { isAuthed, user, logout } = useAuth();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleToggle = (e) => {
    if (e.target.checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-6">

      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold">
          CodeWise
        </Link>
      </div>

      <div className="flex gap-2 items-center">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "btn btn-primary" : "btn btn-ghost"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/problems"
          className={({ isActive }) =>
            isActive ? "btn btn-primary" : "btn btn-ghost"
          }
        >
          Problems
        </NavLink>

        {isAuthed && (
          <NavLink
            to="/submissions"
            className={({ isActive }) =>
              isActive ? "btn btn-primary" : "btn btn-ghost"
            }
          >
            Submissions
          </NavLink>
        )}

        {isAuthed && user?.role === "ADMIN" && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive || location.pathname.startsWith("/admin") ? "btn btn-primary" : "btn btn-ghost"
            }
          >
            Admin
          </NavLink>
        )}

        {!isAuthed && (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "btn btn-primary text-white" : "btn btn-ghost"
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? "btn btn-primary text-white" : "btn btn-ghost"
              }
            >
              Register
            </NavLink>
          </>
        )}

        {isAuthed && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              {user?.username || user?.email || "Account"}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li><Link to="/profile">Profile</Link></li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </ul>
          </div>
        )}

        <label className="swap swap-rotate ml-2 btn btn-ghost btn-circle">
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" onChange={handleToggle} checked={theme === "dark"} />
          
          {/* sun icon */}
          <Sun className="swap-off w-6 h-6" />
          
          {/* moon icon */}
          <Moon className="swap-on w-6 h-6" />
        </label>

      </div>

    </div>
  );
}

export default Navbar;