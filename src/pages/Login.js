import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/hospi.png";
import LoadingSpinner from "../components/Loading.js";
import { login } from "../adminAPI.js";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.token) {
      console.log("dsad");
      let role = localStorage.role;
      role == "admin"
        ? navigate(`/${role}/dashboard`)
        : navigate(`/${role}/home`);
    }
  }, []);

  const signIn = async () => {
    let formEl = document.forms.signInForm;
    let formData = new FormData(formEl);

    let body = {};
    for (const pair of formData.entries()) {
      body[pair[0]] = pair[1];
    }

    let data = await login(body);
    console.log(data);
    if (data.message == "welcome") {
      if (data.role == "admin") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        navigate("/admin/dashboard");
      } else if (data.role == "patient") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        navigate("/patient/home");
      } else if (data.role == "doctor") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        navigate("/doctor/home");
      } else {
        alert("not authorized");
      }
    } else {
      alert(data.message);
    }
    setLoading(false);
  };

  useLayoutEffect(() => {
    document.querySelector("body").style.background = "#0466c8";
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".login");

    sign_up_btn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });

    sign_in_btn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });
  }, []);

  return (
    <div className="login">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="forms-container">
            <div className="signin-signup">
              <form id="signInForm" className="sign-in-form">
                <h2 className="title">Sign in</h2>
                <div className="input-field">
                  <i className="las la-user-circle" />
                  <input
                    name="email"
                    type="text"
                    placeholder="E-mail"
                    defaultValue="admin@hospi.com"
                  />
                </div>
                <div className="input-field">
                  <i className="las la-key" />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    defaultValue="Ha123"
                  />
                </div>
                <input
                  type="submit"
                  defaultValue="Login"
                  className="btn solid"
                  onClick={() => {
                    setLoading(true);
                    signIn();
                  }}
                />
                {/* <p className="social-text">Or Sign in with social platforms</p>
                <div className="social-media">
                  <a href="#" className="social-icon">
                    <i className="las la-facebook" />
                  </a>
                  <a href="#" className="social-icon">
                    <i className="las la-google-plus" />
                  </a>
                </div> */}
              </form>
              <form id="signUpForm" className="sign-up-form">
                <h2 className="title">Sign up</h2>
                <div className="input-field">
                  <i className="las la-envelope" />
                  <input name="email" type="email" placeholder="Email" />
                </div>
                <div className="input-field">
                  <i className="las la-key" />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                </div>
                <div className="input-field">
                  <i className="las la-calendar" />
                  <input
                    name="birthDate"
                    type="date"
                    placeholder="Birth Date"
                  />
                </div>
                <input type="submit" className="btn" defaultValue="Sign up" />
                {/* <p className="social-text">Or Sign up with social platforms</p>
                <div className="social-media">
                  <a href="#" className="social-icon">
                    <i className="fab fa-facebook-f" />
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-google" />
                  </a>
                </div> */}
              </form>
            </div>
          </div>
          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <img src={logo} width="40%" alt="" />
                <p>Hospital Management System</p>
                <button className="btn transparent" id="sign-up-btn">
                  Sign up
                </button>
              </div>
              <img src className="image imagesign-up" alt="" />
            </div>
            <div className="panel right-panel">
              <div className="content">
                <h3>Already a user ?</h3>
                <p></p>
                <button className="btn transparent" id="sign-in-btn">
                  Sign in
                </button>
              </div>
              <img src className="image imagesign-in" alt="" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
