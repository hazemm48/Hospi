import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import logo from "../images/hospi 2.jpg";
import LoadingSpinner from "../components/Loading.js";
import { login, signUpApi } from "../adminAPI.js";
import moment from "moment";
import { useForm } from "react-hook-form";
import { validate } from "../validation/FormValidate.js";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [birthDate, setBirthDate] = useState();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let years = () => {
    let arr = [];
    for (
      let i = moment().year() - 1;
      i > moment().subtract(100, "years").year();
      i--
    ) {
      arr.push(i);
    }
    return arr;
  };
  let days = () => {
    let arr = [];
    for (let i = 1; i <= 31; i++) {
      arr.push(i);
    }
    return arr;
  };

  useEffect(() => {
    if (localStorage.token) {
      let role = localStorage.role;
      role == "admin"
        ? navigate(`/${role}/dashboard`)
        : navigate(`/${role}/home`);
    }
  }, []);

  const signIn = async (obj) => {
    let formEl = document.forms.signInForm;
    let formData = new FormData(formEl);
    console.log(obj);
    let body = {};
    if (obj) {
      body = {
        email: obj.email,
        password: obj.password,
      };
    } else {
      body = {
        email: formData.get("emaill").toLowerCase(),
        password: formData.get("passwordd"),
      };
    }

    let data = await login(body);
    console.log(data);
    if (data.message == "welcome") {
      let setToken = () => {
        localStorage.setItem(
          "token",
          JSON.stringify({
            key: data.token,
            expiry: data.expiry,
          })
        );
        localStorage.setItem("role", data.role);
      };
      if (data.role == "admin") {
        setToken();
        navigate("/admin/dashboard");
      } else if (data.role == "patient") {
        setToken();
        navigate("/patient/home");
      } else if (data.role == "doctor") {
        setToken();
        navigate("/doctor/home");
      } else {
        navigate("/notAuthorized");
      }
    } else {
      alert(data.message);
    }
  };

  const signUp = async (data) => {
    let bd = moment(`${data.day}-${data.month}-${data.year}`, "DMYYYY").format(
      "MM-DD-YYYY"
    );
    ["day", "month", "year"].forEach((e) => delete data[e]);
    let body = {
      ...data,
      patientInfo: {
        birthDate: bd,
      },
      role: "patient",
    };
    console.log(body);
    let { message } = await signUpApi(body);
    if (message == "patient added") {
      await signIn(body);
    } else if ((message = "already registered")) {
      alert(message);
    } else {
      alert("Something went wrong, Please try again later");
    }
  };

  useLayoutEffect(() => {
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
                  <i className="las la-envelope" />
                  <input
                    name="emaill"
                    type="text"
                    placeholder="E-mail"
                    required
                  />
                </div>
                <div className="input-field">
                  <i className="las la-key" />
                  <input
                    name="passwordd"
                    type="password"
                    placeholder="Password"
                    required
                  />
                </div>
                <input
                  type="button"
                  onClick={() => {
                    signIn();
                  }}
                  defaultValue="Login"
                  className="btn solid"
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
              <form
                id="signUpForm"
                className="sign-up-form"
                onSubmit={handleSubmit(signUp)}
              >
                <h2 className="title">Sign up</h2>
                <div className="input-field">
                  <i className="las la-user-circle" />
                  <input
                    name="name"
                    type="text"
                    placeholder="Your Full Name"
                    {...register("name", validate("name"))}
                  />
                  {errors.name && (
                    <>
                      <i className="login-warning las la-exclamation-triangle " />
                      <small className="text-warning">
                        {errors.name.message}
                      </small>
                    </>
                  )}
                </div>
                <div className="input-field">
                  <i className="las la-envelope" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    {...register("email", validate("email"))}
                  />
                  {errors.email && (
                    <>
                      <i className="login-warning las la-exclamation-triangle " />
                      <small className="text-warning">
                        {errors.email.message}
                      </small>
                    </>
                  )}
                </div>
                <div className="input-field">
                  <i className="las la-key" />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    {...register("password", validate("password"))}
                  />
                  {errors.password && (
                    <>
                      <i className="login-warning las la-exclamation-triangle " />
                      <small className="text-warning">
                        {errors.password.message}
                      </small>
                    </>
                  )}
                </div>
                {/*                 <div className="input-field">
                  <i className="las la-calendar" />
                  <DatePicker
                    name="birthDate"
                    placeholderText="Birth Date"
                    minDate={moment().subtract(100, "years")._d}
                    maxDate={moment().subtract(1, "years")._d}
                    selected={birthDate}
                    onChange={setBirthDate}
                    dateFormat="dd-MM-yyyy"
                    showYearDropdown
                    required
                    dropdownMode="select"
                  />
                </div> */}

                <div
                  id="fff"
                  name="bd"
                  className="form-row"
                  style={{ flexWrap: "inherit", padding: "0px" }}
                >
                  <div className="form-group col-sm-3">
                    <div className="input-field">
                      <i />
                      <select
                        name="day"
                        style={{ background: "none", border: "none" }}
                        {...register("day", { required: true })}
                      >
                        {days().map((e) => {
                          return <option value={e}>{e}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="form-group col-sm-5">
                    <div className="input-field">
                      <i />
                      <select
                        name="month"
                        style={{ background: "none", border: "none" }}
                        {...register("month", { required: true })}
                      >
                        {moment.months().map((e, i) => {
                          return <option value={i + 1}>{e}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="form-group col-sm-4">
                    <div className="input-field">
                      <i />
                      <select
                        name="year"
                        style={{ background: "none", border: "none" }}
                        {...register("year", { required: true })}
                      >
                        {years().map((e) => {
                          return <option value={e}>{e}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  {errors.year && (
                    <>
                      <i className="login-warning las la-exclamation-triangle " />
                      <small className="text-warning">
                        Birth date is required
                      </small>
                    </>
                  )}
                </div>
                <div className="input-field">
                  <i className="las la-transgender" />
                  <select
                    name="gender"
                    style={{ background: "none", border: "none" }}
                    {...register("gender", { required: true })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <input type="submit" className="btn" defaultValue="Sign up" />
                {/*                 <p className="social-text">Or Sign up with social platforms</p>
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
