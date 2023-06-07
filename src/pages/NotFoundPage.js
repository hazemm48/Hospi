import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../images/hospi.png";
import notFound from '../images/404.svg'

const NotFoundPage = () => {
  let { state } = useLocation();

  if (state?.includes("home")) {
    localStorage.removeItem("token");
  }

  return (
    <div className="main-content">
      <div className="container-fluid notFound">
        <nav>
          <Link to="/" class="logo">
            <img src={logo} />
          </Link>
        </nav>
        <section class="page-not-found">
          <img src={notFound}/>
          <h1>Page Not Found</h1>
          <p>
            Sorry can't find the page you are looking for
            <Link to="/"> click Here</Link> to go back to home page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default NotFoundPage;
