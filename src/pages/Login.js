import React, { useEffect, useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { login, navDetails } from "../../src/adminAPI";
import logo from "../images/hospi.png";
import logo1 from "../images/hospi 1.png";
import LoadingSpinner from "../components/Loading.js";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.token) {
      console.log("dsad");
      navigate("/home/dashboard");
    }
  }, []);

  const validate = async () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let body = {
      email: email,
      password: password,
    };
    let data = await login(body);
    if (data.message == "welcome") {
      localStorage.setItem("token", data.token);
      setTimeout(() => {
        navigate("/home/dashboard");
      }, 1000);
    } else {
      alert(data.message);
    }
  };

  return (
    <React.Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form className="form-signin text-center">
          <img className="mb-4" src={logo} alt="" width={160} height={160} />
          <label htmlFor="inputEmail" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Email address"
            required
            autofocus
            defaultValue="admin@hospi.com"
          />
          <label htmlFor="inputPassword" className="sr-only">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Password"
            required
            defaultValue="Ha123"
          />
          <button
            className="btn btn-lg btn-primary btn-block"
            type="button"
            onClick={() => {
              setLoading(true);
              validate();
            }}
          >
            Sign in
          </button>
          <p className="mt-5 mb-3 text-muted">© HOSPI</p>
        </form>
      )}
    </React.Fragment>
  );
};

export default Login;
