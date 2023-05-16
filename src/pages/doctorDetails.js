import moment from "moment-timezone";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { updateUser, users, reserve, getGeneral } from "../adminAPI.js";
import FilesCard from "../components/FilesCard.js";
import LoadingSpinner from "../components/Loading.js";
import NotesCard from "../components/NotesCard.js";
import Schedule from "../components/Schedule.js";
import manImg from "../images/man.svg";
import Calendar from "./Calender.js";

const DoctorDetails = () => {
  const id = useLocation();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState();
  const [htmlData, setHtmlData] = useState([]);
  const [specialities, setSpecialities] = useState();
  const [calView, setCalView] = useState(false);

  let createHtmlData = (state) => {
    setHtmlData([
      ["gender", state.gender, "gender"],
      ["phone", state.phone, "phone number"],
      ["room", state.doctorInfo.room, "room"],
      ["examinFees", state.doctorInfo.fees.examin, "examination fees"],
      ["followUpFees", state.doctorInfo.fees.followUp, "follow up fees"],
      ["city", state.doctorInfo.city, "city"],
      [
        "bd",
        moment(state.doctorInfo.birthDate).format("DD/MM/YYYY"),
        "date of birth",
      ],
      ["sta", state.isLoggedIn ? "Online" : "Offline", "member status"],
      [
        "reg",
        moment(state.createdAt).local().format("DD/MM/YYYY"),
        "registered date",
      ],
    ]);
  };

  const GetDetails = async () => {
    let body = {
      id: id.state,
    };
    let user = await users(body);
    setState(user.users);
    createHtmlData(user.users);
    setLoading(false);
  };

  const GetSpecialities = async () => {
    let body = {
      filter: "specialities",
    };
    let general = await getGeneral(body);
    delete general.data[0].specialities[0];
    setSpecialities(general.data[0].specialities);
  };

  useLayoutEffect(() => {
    setLoading(true);
    GetDetails();
    GetSpecialities();
  }, []);

  const editDoc = () => {
    let elements = document.querySelectorAll("input,textArea,select");
    let x = false;
    elements.forEach((e, i) => {
      if (!["sta", "reg"].includes(e.name)) {
        if (e.hasAttribute("disabled")) {
          e.removeAttribute("disabled");
          document.querySelector("#delSchBtn").removeAttribute("hidden");
          document.getElementById("editDoc").innerHTML = "submit";
          x = false;
        } else {
          x = true;
        }
      }
    });
    x && updateDoc();
  };

  const updateDoc = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let schForm = document.forms.schForm;
    let schFormData = new FormData(schForm);
    let schedule = [];
    let schObj = [];
    console.log(formData);
    schFormData.forEach((value, key) => {
      let obj = {};
      obj[key] = value;
      schObj.push(obj);
    });

    for (let i = 0; i < schObj.length; i += 4) {
      const three = [
        schObj[i],
        { time: { ...schObj[i + 1], ...schObj[i + 2] } },
        schObj[i + 3],
      ];
      schedule.push(Object.assign({}, ...three));
    }
    console.log(schedule);
    let body = {
      details: {
        name: document.getElementById("name").value,
        email: formData.get("email"),
        gender: formData.get("gender"),
        phone: formData.get("phone"),
        doctorInfo: {
          city: formData.get("city"),
          room: formData.get("room"),
          fees: {
            examin: formData.get("examinFees"),
            followUp: formData.get("followUpFees"),
          },
          bio: formData.get("bio"),
          birthDate: moment(formData.get("bd"), "DDMMYYYY").format(
            "MM-DD-YYYY"
          ),
          speciality: formData.get("speciality"),
          schedule: schedule,
        },
      },
      id: state._id,
    };
    console.log(body);
  };

  return (
    <React.Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : calView ? (
        <Calendar filter={{doctorId:id.state}}/>
      ) : (
        <div className="main-content">
          {state ? (
            <div className="container-fluid">
              <div className="section row title-section">
                <div className="col-md-8">
                  <div aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/home/doctors">
                          <a>doctors</a>
                        </Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        {state.name}
                      </li>
                    </ol>
                  </div>
                </div>
                <div className="col-md-4">
                  <button
                    id="editDoc"
                    className="btn btn-dark-red-f-gr"
                    onClick={() => {
                      editDoc();
                    }}
                  >
                    <i className="las la-edit" />
                    edit doctor
                  </button>
                </div>
              </div>
              <div className="section patient-details-section">
                <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="card">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="mini-card text-center">
                                <div className="card-header">
                                  <img
                                    className="rounded-circle"
                                    src={manImg}
                                    loading="lazy"
                                  />
                                </div>
                                <div className="card-body">
                                  <input
                                    name="name"
                                    id="name"
                                    className="form-control"
                                    defaultValue={state.name}
                                    disabled
                                    style={{ textAlign: "center" }}
                                  />

                                  <small className="text-muted">
                                    {state._id}
                                  </small>
                                  <h5>Age</h5>
                                  <p>
                                    {moment().diff(
                                      state?.doctorInfo?.birthDate,
                                      "years"
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div
                              id="editDet"
                              className="col-md-8 doctors-details-card-wrapper"
                            >
                              <form id="form" method="post">
                                <div className="mini-card">
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <label>speciality</label>
                                          <select
                                            className="form-control form-select dropdown-toggle"
                                            name="speciality"
                                            disabled
                                          >
                                            {specialities?.map((e) => {
                                              return (
                                                <option value={e}>{e}</option>
                                              );
                                            })}
                                          </select>
                                        </div>
                                      </div>
                                      {htmlData.map((e) => {
                                        return (
                                          <div className="col-md-4">
                                            <div className="form-group">
                                              <label>{e[2]}</label>
                                              <input
                                                name={e[0]}
                                                className="form-control"
                                                disabled
                                                defaultValue={e[1]}
                                              />
                                            </div>
                                          </div>
                                        );
                                      })}

                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <label>email</label>
                                          <input
                                            name="email"
                                            className="form-control"
                                            disabled
                                            defaultValue={state.email}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <label>bioghraphy</label>
                                          <textarea
                                            name="bio"
                                            className="form-control"
                                            rows={6}
                                            disabled
                                            defaultValue={state.doctorInfo?.bio}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="card">
                          <form id="schForm" method="post">
                            <div className="mini-card">
                              <div className="card-body">
                                <div className="row">
                                  {state.doctorInfo?.schedule.map((e, i) => {
                                    return (
                                      <Schedule
                                        docDetails={true}
                                        key={i}
                                        schDetails={e}
                                        index={i}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="card">
                          <div className="mini-card">
                            <div className="col-md-4">
                              <button
                                className="btn btn-dark-red-f-gr"
                                onClick={()=>{setCalView(true)}}
                              >
                                <i className="las la-edit" />
                                Calendar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <NotesCard id={state._id} />
                    <FilesCard />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default DoctorDetails;
