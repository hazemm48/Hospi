import React from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../images/hospi.png";
import manImg from "../images/man.svg";

const Header = ({ user }) => {
  let navigate = useNavigate();

  const dropMenu = () => {
    let headerDrop = document.getElementById("headerDrop");
    if (headerDrop.classList.contains("show")) {
      document.getElementById("headerDrop").classList.remove("show");
      document.getElementById("drop").classList.remove("show");
      document.getElementById("aria").setAttribute("aria-expanded", "false");
    } else {
      document.getElementById("headerDrop").classList.add("show");
      document.getElementById("drop").classList.add("show");
      document.getElementById("aria").setAttribute("aria-expanded", "true");
    }
  };

  const logout = () => {
    delete localStorage.token;
    delete localStorage.role;
    delete localStorage.apiMedicToken;
    navigate("/");
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top">
        <Link
          to={`/${user.role}/${user.role == "admin" ? "dashboard" : "home"}`}
          className="navbar-brand"
        >
          <img src={logo} />
        </Link>
        
        <div className="navbar-collapse">
          <ul className="navbar-nav">
            <li
              id="headerDrop"
              className="nav-item"
              onClick={() => {
                dropMenu();
              }}
            >
              <a
                className="nav-link profile-dropdown"
                id="aria"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  className="rounded-circle"
                  src={user.image ? user.image : manImg}
                />
                <span className="blue-text">{user.name}</span>
              </a>
              <div className="dropdown">
                <div
                  id="drop"
                  className="dropdown-menu shadow-lg profile-dropdown-menu"
                  aria-labelledby="profile-dropdown"
                >
                  <Link to={`/${user.role}/settings`} className="dropdown-item">
                    <i className="las la-cog mr-2" />
                    settings
                  </Link>
                  <a
                    className="dropdown-item"
                    onClick={() => {
                      logout();
                    }}
                  >
                    <i className="las la-sign-out-alt mr-2" />
                    logout
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
