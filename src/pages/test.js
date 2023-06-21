/* import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../src/adminAPI";
import logo from "../images/hospi.png";
import LoadingSpinner from "../components/Loading.js";

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

  const validate = async () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let body = {
      email: email,
      password: password,
    };
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

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section title-section">
          <h5 className="page-title">Patients</h5>
        </div>
        <div className="section filters-section">
          <div className="dropdowns-wrapper">
            <div className="dropdown">
              <select
                id={props.type ? "category" : "sort"}
                className="form-select dropdown-toggle"
                role="button"
                onChange={() => {
                  props.setLoading(true);
                  props.GetDetails();
                }}
              >
                {props.sortValues.map((e) => {
                  if (e[0] == props.selOpt) {
                    return (
                      <option selected value={e[0]}>
                        {e[1]}
                      </option>
                    );
                  }
                  return <option value={e[0]}>{e[1]}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="switch-view-btns">
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
              <label id="card" className="btn btn-darker-grey-o active">
                <input
                  id="card-view-btn"
                  type="radio"
                  name="options"
                  defaultChecked
                  onClick={(e) => {
                    changeView(e);
                  }}
                />
                <i className="las la-th-large" />
              </label>
              <label id="tab" className="btn btn-darker-grey-o">
                <input
                  id="table-view-btn"
                  type="radio"
                  name="options"
                  onClick={(e) => {
                    changeView(e);
                  }}
                />
                <i className="las la-list-ul" />
              </label>
            </div>
          </div>
          <form id="search" method="post" className="ml-auto">
            <div className="form">
              <div className="form-group col-sm-12">
                <div className="input-group ">
                  <div class="input-group-append">
                    <select class="input-group-text" name="srchSlct" required>
                      {options.map((e) => {
                        return <option value={e}>{e.toUpperCase()}</option>;
                      })}
                    </select>
                  </div>
                  <input name="search" className="form-control" />
                  <div class="input-group-append">
                    <button
                      type="button"
                      className="input-group-text"
                      id="basic-addon2"
                      onClick={() => {
                        searchData();
                      }}
                    >
                      <i className="las la-search" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {superAdmin && (
            <div className="buttons-wrapper ml-auto">
              <Link to="/admin/addPatient">
                <button className="btn btn-dark-red-f-gr">
                  <i className="las la-plus-circle" />
                  add a new patient
                </button>
              </Link>
            </div>
          )}
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div
              class="section "
              id="data-table6_info"
              role="status"
              aria-live="polite"
            >
              Showing{" "}
              <span style={{ color: "#00b4d8" }}>
                {pageNo < Math.ceil(length / resultLimit)
                  ? (pageNo - 1) * resultLimit + resultLimit
                  : length}
              </span>{" "}
              out of <span style={{ color: "#00b4d8" }}>{length} </span>results
            </div>
            <div id="cv" className="section patients-card-view">
              <div className="row">
                {users.length > 0 &&
                  users.map((user, i) => {
                    let cl = "";
                    console.log(props.favDocs);

                    if (props.favDocs?.includes(user._id)) {
                      cl = "active";
                    }
                    return (
                      <div className="col-md-4">
                        <div className="card">
                          <div className="card-header">
                            <div className="card-img-top">
                              <img
                                className="rounded-circle"
                                src={
                                  user.image
                                    ? user.image
                                    : user.gender == "male"
                                    ? maleImg
                                    : femaleImg
                                }
                                loading="lazy"
                              />
                              {["admin", "doctor"].includes(props.role) ? (
                                <Link
                                  to={`/${props.role}/${props.type}Details`}
                                  state={user._id}
                                  className="view-more"
                                >
                                  view profile
                                </Link>
                              ) : (
                                <div className="float-right">
                                  <label
                                    className={`heart ${cl}`}
                                    onClick={(e) => {
                                      favDoc(e, { id: user._id });
                                    }}
                                  >
                                    ❤
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="card-subsection-title">
                              <h5>{user.name}</h5>
                            </div>
                            <div className="card-subsection-body">
                              <label className="text-muted">
                                {props.type == "doctor"
                                  ? "speciality"
                                  : "email"}
                              </label>
                              <p>
                                {props.type == "doctor"
                                  ? user.doctorInfo?.speciality
                                  : user.email}
                              </p>
                              {props.type != "admin" && (
                                <>
                                  <label className="text-muted">
                                    {props.type == "doctor"
                                      ? "schedule"
                                      : "date of birth"}{" "}
                                  </label>
                                  <p>
                                    {props.type == "doctor"
                                      ? user.scheduleDays.join(" , ")
                                      : user[`${props.type}Info`]?.birthDate &&
                                        moment(
                                          user[`${props.type}Info`].birthDate
                                        ).format("DD/MM/YYYY")}
                                  </p>
                                </>
                              )}
                              <label className="text-muted">gender</label>
                              <p>{user.gender}</p>
                            </div>
                          </div>
                          {props.type == "doctor" && (
                            <div className="card-footer">
                              <Link
                                to={`/${props.role}/addReserve`}
                                state={{ id: user._id, type: "doctor" }}
                                className="float-right"
                              >
                                <button className="btn btn-dark-red-f-gr">
                                  reserve
                                </button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div
              id="tv"
              className={`section patients-table-view ${props.display}`}
            >
              <table className="table table-hover table-responsive-lg">
                <thead>
                  <tr>
                    {table?.map((e) => {
                      return <th>{e}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {users &&
                    users.map((user) => {
                      return (
                        <tr>
                          <td>
                            <img
                              className="rounded-circle"
                              src={
                                user.image
                                  ? user.image
                                  : user.gender == "male"
                                  ? maleImg
                                  : femaleImg
                              }
                              loading="lazy"
                            />
                            <span className="ml-2">{user.name}</span>
                          </td>
                          <td>{user.gender}</td>
                          {props.type != "admin" && (
                            <>
                              <td>
                                {moment(
                                  user[`${props.type}Info`]?.birthDate
                                ).format("DD/MM/YYYY")}
                              </td>
                              <td>
                                {props.type == "doctor"
                                  ? user.doctorInfo?.speciality
                                  : moment().diff(
                                      user[`${props.type}Info`]?.birthDate,
                                      "years"
                                    )}
                              </td>
                            </>
                          )}
                          <td>
                            {props.type == "doctor" ? user.phone : user.email}
                          </td>
                          <td>
                            {["admin", "doctor"].includes(role) && (
                              <Link
                                to={`/${props.role}/${props.type}Details`}
                                state={user._id}
                                className="view-more btn btn-sm btn-dark-red-f"
                              >
                                view profile
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <div aria-label="Page navigation example" className="section">
        <ul class="pagination justify-content-start">
          <li class="page-item disabled">
            <a class="page-link" tabindex="-1">
              Pages
            </a>
          </li>
          <li
            class="page-item active"
            onClick={(e) => {
              changePage(e);
            }}
          >
            <button class="page-link" name="page" tabIndex="1">
              1
            </button>
          </li>
          {pagination()}
        </ul>
      </div>
    </div>
  );
};

export default Login;
 */